import type {
  IAccountTypes,
  NetWorthReportQuery,
  NetWorthReportResults,
  NetWorthReportRow,
} from '@angelfish/core'
import { roundNumber } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('NetWorthReport')

/**
 * Type for Row returned from Net Worth Report query
 */
type Row = {
  month: string
  acc_type: IAccountTypes
  net_worth: number
}

/**
 * Runs the Net Worth Report which calculates the maximum balance of each account by account type
 * for each month in the specified date range.
 *
 * @param query The query settings to filter the report by
 * @returns     NetWorthReportResults
 */
export async function runNetWorthReport({
  start_date,
  end_date,
}: NetWorthReportQuery): Promise<NetWorthReportResults> {
  logger.debug('Running Net Worth Report with query', {
    start_date,
    end_date,
  })

  const sqlQuery = `
    WITH RECURSIVE
    -- Month boundaries
    first_month AS (SELECT date(:start_date, 'start of month') AS m),
    last_month  AS (SELECT date(:end_date,   'start of month') AS m),

    -- Accounts we care about
    accounts_of_interest AS (
    SELECT id AS account_id, acc_type
    FROM accounts
    WHERE class = 'ACCOUNT'
    ),

    -- Starting balance at the beginning of the range:
    -- acc_start_balance + all local_amount from transactions for this account before start_date
    initial_balance AS (
    SELECT
        a.id AS account_id,
        a.acc_type,
        COALESCE(a.acc_start_balance, 0)
        + COALESCE((
            SELECT SUM(li.local_amount)
            FROM line_items li
            JOIN transactions t ON t.id = li.transaction_id
            WHERE t.account_id = a.id
                AND date(t.date) < date(:start_date)
            ), 0) AS init_bal
    FROM accounts a
    WHERE a.class = 'ACCOUNT'
    ),

    -- Daily deltas within the requested date range,
    -- grouped by the *transaction's* account_id
    deltas AS (
    SELECT
        t.account_id AS account_id,
        date(t.date) AS d,
        SUM(li.local_amount) AS delta
    FROM line_items li
    JOIN transactions t ON t.id = li.transaction_id
    JOIN accounts a      ON a.id = t.account_id
    WHERE a.class = 'ACCOUNT'
        AND date(t.date) >= date(:start_date)
        AND date(t.date) <= date(:end_date)
    GROUP BY t.account_id, date(t.date)
    ),

    -- Running daily balance: init_bal + cumulative deltas per account
    running AS (
    SELECT
        d.account_id,
        i.acc_type,
        d.d,
        i.init_bal
        + SUM(d.delta) OVER (
            PARTITION BY d.account_id
            ORDER BY d.d
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS balance
    FROM deltas d
    JOIN initial_balance i ON i.account_id = d.account_id
    ),

    -- For each account and month, take the maximum balance seen in that month
    monthly_max_raw AS (
    SELECT
        account_id,
        acc_type,
        date(d, 'start of month') AS month,
        MAX(balance) AS max_bal
    FROM running
    GROUP BY account_id, acc_type, month
    ),

    -- Fill-forward per-account monthly values across the whole range
    filled(account_id, acc_type, month, max_bal_filled) AS (
    -- Seed (first month in range): use that month's max if present; else initial balance
    SELECT
        a.account_id,
        a.acc_type,
        (SELECT m FROM first_month) AS month,
        COALESCE(mr.max_bal, i.init_bal) AS max_bal_filled
    FROM accounts_of_interest a
    JOIN initial_balance i
        ON i.account_id = a.account_id
    LEFT JOIN monthly_max_raw mr
        ON mr.account_id = a.account_id
    AND mr.month = (SELECT m FROM first_month)

    UNION ALL

    -- Step: advance month-by-month to last_month; carry forward if no max
    SELECT
        f.account_id,
        f.acc_type,
        date(f.month, '+1 month') AS month,
        COALESCE(mr.max_bal, f.max_bal_filled) AS max_bal_filled
    FROM filled f
    LEFT JOIN monthly_max_raw mr
        ON mr.account_id = f.account_id
    AND mr.month = date(f.month, '+1 month')
    WHERE date(f.month, '+1 month') <= (SELECT m FROM last_month)
    )

    -- Sum per acc_type per month; display month as MM-YYYY
    SELECT
    strftime('%m-%Y', month) AS month,
    acc_type,
    SUM(max_bal_filled) AS net_worth
    FROM filled
    GROUP BY month, acc_type
    ORDER BY date(month), acc_type
`
  // Run the query
  const query = DatabaseManager.getConnection()
    .createQueryBuilder()
    .select('*')
    .from(`(${sqlQuery})`, 'nw')
    .setParameters({
      start_date,
      end_date,
    })

  const results = await query.getRawMany<Row>()
  logger.debug('Net Worth Report query returned rows', results)

  // Create array of periods
  const periodsSet = new Set<string>()
  results.forEach((row) => {
    periodsSet.add(row.month)
  })

  return {
    periods: Array.from(periodsSet),
    rows: results.reduce((acc, row) => {
      let rowObj = acc.find((r) => r.acc_type === row.acc_type)
      if (!rowObj) {
        rowObj = { acc_type: row.acc_type } as NetWorthReportRow
        acc.push(rowObj)
      }
      rowObj[row.month] = roundNumber(row.net_worth)
      return acc
    }, [] as NetWorthReportRow[]),
  }
}
