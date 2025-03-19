import type {
  AppCommandRequest,
  AppCommandResponse,
  CategoryGroupType,
  CategoryType,
  ReportsData,
  ReportsDataCategoryRow,
  ReportsDataRow,
} from '@angelfish/core'
import { AppCommandIds, Command, Logger } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { UNCLASSIFIED_EXPENSES_ID, UNCLASSIFIED_INCOME_ID } from '../transactions'
import { ExportXLSX } from './export-xlsx'

const logger = Logger.scope('ReportsService')

/**
 * Type for Row returned from database queries
 */
export type ReportResultRow = {
  month: string
  cat_group_id: number | null
  cat_group_name: string
  cat_group_type: CategoryGroupType
  cat_group_icon: string
  cat_group_color: string
  cat_id: number | null
  cat_name: string
  cat_icon: string
  cat_type: CategoryType | 'Unknown'
  total: number
}

/**
 * Manages Reports Table and provides main methods to generate queries for
 * displaying reports in App
 */
class ReportsServiceClass {
  /**
   * Returns a monthly breakdown of expenses grouped by CategoryGroup and Category. Returns the following
   * object:
   *
   * {
   *    periods: ["01-2021", "02-2021"..."total"],
   *    rows: [
   *      {
   *        id: 1,
   *        name: "Bank Charges",
   *        icon: "bank",
   *        cat_type: "Expense",
   *        "01-2021": 200.12
   *        "02-2021": 0,
   *        ...
   *        "total": 200.12,
   *        categories: [
   *          {
   *            id: 2,
   *            name: "Service Charges",
   *            icon: "bank",
   *            "01-2021": 200.12
   *            "02-2021": 0,
   *            ...
   *            "total": 200.12,
   *          }
   *        ]
   *      }
   *    ]
   * }
   *
   * This allows React-Table to render table by looking up keys for each period (header), expand subrows (categories)
   * and display total column at end for each row. You can group on cat_type to aggregate income and expense categories
   *
   * @param query                 The query settings to filter the report by
   * @returns                     Object as described above
   */
  @Command(AppCommandIds.RUN_REPORT)
  public async runReport({
    start_date,
    end_date,
    include_unclassified = true,
  }: AppCommandRequest<AppCommandIds.RUN_REPORT>): AppCommandResponse<AppCommandIds.RUN_REPORT> {
    /* First get all the classified line items that aren't transfers between accounts
     * summed by month in mmm-YY format and category as it would be in rendered table
     *
     * Uses Common Table Expressions to create virtual tables to get final result:
     *
     * 1. First compute all the days between date range so we don't end up with missing months in table if no line items
     *    exist those months
     * 2. Then compute all the distinct categories for that date range (ignoring transfers) so we have consistent category
     *    rows for every month even if no values exist that month
     * 3. Combine these two results into a table that has a row for every category for each day (reportTable)
     * 4. Create another virtual table to get all the lineItems with their dates from the transactions table
     * 5. Finally join the lineItems to the report table, sum the amounts and group by month so we get the output we want
     */
    const classifiedResults: ReportResultRow[] = await DatabaseManager.getConnection().query(`
        WITH RECURSIVE
          days(day) AS (
              VALUES('${start_date}')
            UNION ALL
            SELECT date(day, '+1 day')
            FROM days
            WHERE day < '${end_date}'
          ),
          categories AS (
            SELECT 
              DISTINCT line_items.account_id as 'cat_id' ,
              category_groups.type as 'cat_group_type',
              category_groups.color as 'cat_group_color',
              accounts.cat_group_id as 'cat_group_id',
              category_groups.name as 'cat_group_name',
              category_groups.icon as 'cat_group_icon',
              accounts.name as 'cat_name',
              accounts.cat_icon as 'cat_icon',
              accounts.cat_type as 'cat_type'
            FROM line_items 
            LEFT JOIN transactions ON transactions.id == line_items.transaction_id
            LEFT JOIN accounts on accounts.id == line_items.account_id
            LEFT JOIN category_groups on category_groups.id == accounts.cat_group_id
            WHERE (transactions.date BETWEEN '${start_date}' AND '${end_date}') AND (accounts.class != 'ACCOUNT')
            ORDER BY category_groups.type, category_groups.name, accounts.name
          ),
          reportTable AS (
            SELECT *
            FROM days 
            LEFT OUTER JOIN categories 
          ),
          lineItems AS (
            SELECT
              line_items.id as 'id',				
              strftime("%Y-%m-%d", transactions.date) as 'date',
              line_items.local_amount as 'amount',
              line_items.account_id as 'cat_id'
            FROM line_items
            LEFT JOIN transactions ON transactions.id == line_items.transaction_id
            WHERE (transactions.date BETWEEN '${start_date}' AND '${end_date}') 
          )
        SELECT 
          strftime("%m-%Y", reportTable.day) as month,
          strftime("%m", reportTable.day) as calendar_month,
          strftime("%Y", reportTable.day) as calendar_year,
          reportTable.cat_group_id,
          reportTable.cat_group_name,
          reportTable.cat_group_type,
          reportTable.cat_group_icon,
          reportTable.cat_group_color,
          reportTable.cat_id,
          reportTable.cat_name,
          reportTable.cat_icon,
          reportTable.cat_type,
          COALESCE(ROUND(SUM(lineItems.amount) * -1, 2), 0) as 'total'
        FROM reportTable
        LEFT JOIN lineItems ON lineItems.cat_id == reportTable.cat_id AND reportTable.day == lineItems.date
        GROUP BY month, reportTable.cat_group_id, reportTable.cat_id
        ORDER BY calendar_year ASC, calendar_month ASC
    `)

    let rawResults = classifiedResults

    // Next get unclassified income/expenses if include_unclassified = true
    if (include_unclassified) {
      const unclassifiedResults: ReportResultRow[] = await DatabaseManager.getConnection().query(`
        WITH RECURSIVE
          days(day) AS (
            VALUES('${start_date}')
            UNION ALL
            SELECT date(day, '+1 day')
            FROM days
            WHERE day < '${end_date}'
          ),
          categories(cat_id, cat_group_type, cat_group_color, cat_group_id, cat_group_name, cat_group_icon, cat_name, cat_icon, cat_type) AS (
            values
              (${UNCLASSIFIED_INCOME_ID}, 'Income', NULL, ${UNCLASSIFIED_INCOME_ID}, 'Unclassified Income', 'question', 'Unclassified Income', 'question', 'Unknown'),
              (${UNCLASSIFIED_EXPENSES_ID}, 'Expense', NULL, ${UNCLASSIFIED_EXPENSES_ID}, 'Unclassified Expenses', 'question', 'Unclassified Expenses', 'question', 'Unknown')
          ),
          reportTable AS (
            SELECT * 
            FROM days
            LEFT OUTER JOIN categories
          ),
          lineItems AS (
            SELECT 
              line_items.id as 'id',				
              strftime("%Y-%m-%d", transactions.date) as 'date',
              line_items.local_amount as 'amount',
              CASE 
                WHEN  line_items.amount < 0 THEN 'Income'
                ELSE 'Expense'
              END 'cat_group_type'		
            FROM line_items
            LEFT JOIN transactions ON transactions.id == line_items.transaction_id
            WHERE (transactions.date BETWEEN '${start_date}' AND '${end_date}')  AND line_items.account_id IS NULL
          ) 
        SELECT 
          strftime("%m-%Y", reportTable.day) as month,
          strftime("%m", reportTable.day) as calendar_month,
          strftime("%Y", reportTable.day) as calendar_year,
          reportTable.cat_group_id,
          reportTable.cat_group_name,
          reportTable.cat_group_type,
          reportTable.cat_group_icon,
          reportTable.cat_group_color,
          reportTable.cat_id,
          reportTable.cat_name,
          reportTable.cat_icon,
          reportTable.cat_type,
          COALESCE(ROUND(SUM(lineItems.amount) * -1, 2), 0) as 'total'
        FROM reportTable
        LEFT JOIN lineItems ON lineItems.cat_group_type == reportTable.cat_group_type AND reportTable.day == lineItems.date
        GROUP BY month, reportTable.cat_group_type
        ORDER BY calendar_year ASC, calendar_month ASC
      `)

      // Merge results into results
      rawResults = rawResults.concat(unclassifiedResults)
    }

    // Reorganise results into structure described above so its easy to render table
    const results = rawResults.reduce<ReportsData>(
      (all, row) => {
        // Build array of periods
        const period = row.month
        const periods: string[] = all['periods']
        if (periods.indexOf(period) === -1) {
          periods.push(period)
        }
        all['periods'] = periods

        // Create table category group rows with categories as sub-rows
        const rowIndex = all['rows'].findIndex((x) => {
          if (x.id) {
            return x.id === row.cat_group_id
          }
        })
        if (rowIndex === -1) {
          // Doesn't exist, create new row and subrow
          const newCategory: ReportsDataCategoryRow = {
            id: row.cat_id,
            name: row.cat_name,
            icon: row.cat_icon,
            type: row.cat_type,
            total: row.total,
          }
          newCategory[period] = row.total
          const newRow: ReportsDataRow = {
            id: row.cat_group_id,
            name: row.cat_group_name,
            icon: row.cat_group_icon,
            type: row.cat_group_type,
            color: row.cat_group_color,
            total: row.total,
            categories: [newCategory],
          }
          newRow[period] = row.total
          all['rows'].push(newRow)
        } else {
          // Add to existing total
          const existingRow = all['rows'][rowIndex]
          existingRow[period] = existingRow[period] ? existingRow[period] + row.total : row.total
          existingRow['total'] += row.total
          // Get category and add period to object
          const subRowIndex = existingRow.categories?.findIndex((x) => x.id === row.cat_id)
          if (subRowIndex === -1) {
            // Doesn't exist, create new subrow
            const newCategory: ReportsDataCategoryRow = {
              id: row.cat_id,
              name: row.cat_name,
              icon: row.cat_icon,
              type: row.cat_type,
              total: row.total,
            }
            newCategory[period] = row.total
            existingRow.categories?.push(newCategory)
          } else {
            if (!existingRow.categories) {
              logger.warn('Existing Row has Categories array undefined', existingRow)
              return all
            }
            // Add period to subrow object
            existingRow.categories[subRowIndex as number][period] = row.total
            // Add to existing total
            existingRow.categories[subRowIndex as number]['total'] += row.total
          }
        }

        return all
      },
      { periods: ['total'], rows: [] },
    )

    // Make sure total is at end of periods array
    const totalIndex = results.periods.indexOf('total')
    if (totalIndex !== -1) {
      results.periods.splice(totalIndex, 1)
      results.periods.push('total')
    }

    // Remove any rows with no data (all zeros) for all periods as sometimes we get empty rows
    // for Unclasified Expenses/Income
    results.rows = results.rows.filter((row) => {
      return results.periods.some((period) => {
        if (period === 'total') {
          return row.total !== 0
        }
        return row[period] !== 0
      })
    })

    logger.debug('Report Results', results)

    // Return results
    return results
  }

  /**
   * Export a report to an Excel (XLSX) file. In future will support other formats
   *
   * @param filePath    The path to save the file to
   * @param fileType    The File Type to export as
   * @param query       The query settings to filter the report by
   */
  @Command(AppCommandIds.EXPORT_REPORT)
  public async exportReport({
    filePath,
    fileType,
    query,
  }: AppCommandRequest<AppCommandIds.EXPORT_REPORT>): AppCommandResponse<AppCommandIds.EXPORT_REPORT> {
    logger.info(`Exporting Report with format ${fileType} to ${filePath}`)

    // Get the report data
    const reportData = await this.runReport(query)

    switch (fileType) {
      case 'XLSX':
        // Write the XLSX file
        ExportXLSX.Export(reportData, filePath)
        break
      default:
        throw new Error(`Unsupported File Type ${fileType}`)
    }
  }
}

// Export instance of Class
export const ReportsService = new ReportsServiceClass()
