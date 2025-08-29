import type { IAccount, ITransaction } from '@angelfish/core'
import { UNCLASSIFIED_EXPENSES_ID, UNCLASSIFIED_INCOME_ID } from '@angelfish/core'
import { getLongTransactions, institutions, TestLogger, users } from '@angelfish/tests'
import { ReportsService } from '.'
import { DatabaseManager } from '../../database/database-manager'
import {
  AccountEntity,
  InstitutionEntity,
  TransactionEntity,
  UserEntity,
} from '../../database/entities'

/**
 * Type for storing Flat list of Transactions for verifying
 * report period amounts
 */
type FlatTransaction = {
  id: number
  title: string
  period: string
  amount: number
  account_id?: number
  cat_group_id?: number
  date: Date
}

// Hold list of flattered transactions that were inserted into database
let flatTransactions: FlatTransaction[] = []
// Hold list of accounts in Database
let accounts: IAccount[] = []

beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  // Need to setup database with User, Instutition and Account to import Transactions
  // Do this directly on database without using services to isolate tests from bugs in other
  // service
  const userRepo = DatabaseManager.getConnection().getRepository(UserEntity)
  await userRepo.save(users)
  const institutionRepo = DatabaseManager.getConnection().getRepository(InstitutionEntity)
  await institutionRepo.save(institutions)
  const accountRepo = DatabaseManager.getConnection().getRepository(AccountEntity)
  const newAccount = await accountRepo.save({
    class: 'ACCOUNT',
    name: 'Checking Account',
    acc_institution_id: 1,
    acc_owners: [users[0]],
    acc_mask: '2033',
    acc_type: 'depository',
    acc_subtype: 'checking',
    acc_iso_currency: 'usd',
    acc_start_balance: 0,
    acc_interest_rate: 0,
    acc_limit: 0,
    acc_is_open: true,
  })
  accounts = await accountRepo.find()

  // Insert long list of transactions and change their account_id to the new account
  const longTransactions = getLongTransactions()
  longTransactions.forEach((transaction) => {
    transaction.account_id = newAccount.id
  })
  const transactionRepo = DatabaseManager.getConnection().getRepository(TransactionEntity)
  await transactionRepo.save(longTransactions)

  // Flatten Transactions
  flatTransactions = longTransactions.flatMap((tx: ITransaction) => {
    const txMonth = (tx.date.getUTCMonth() + 1).toString().padStart(2, '0')
    const txYear = tx.date.getUTCFullYear().toString()
    const txPeriod = `${txMonth}-${txYear}`
    return tx.line_items.map((li) => {
      const account = accounts.find((a) => a.id === li.account_id)
      let cat_group_id = account?.cat_group_id
      let account_id = li.account_id
      if (!account) {
        cat_group_id =
          (li.local_amount ?? li.amount) > 0 ? UNCLASSIFIED_INCOME_ID : UNCLASSIFIED_EXPENSES_ID
        account_id =
          (li.local_amount ?? li.amount) > 0 ? UNCLASSIFIED_INCOME_ID : UNCLASSIFIED_EXPENSES_ID
      }
      return {
        id: tx.id,
        title: tx.title,
        date: tx.date,
        period: txPeriod,
        amount: li.local_amount ?? li.amount,
        account_id,
        cat_group_id,
      }
    })
  })
})

afterAll(async () => {
  await DatabaseManager.close()
})

/**
 * Helper functions
 */

/**
 * Helper to get date X months ago
 *
 * @param monthsAgo  Number of months ago
 * @returns          Date X months ago
 */
function getDateMonthsAgo(monthsAgo: number): Date {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() - monthsAgo
  const targetDate = new Date(Date.UTC(year, month, 1))
  return targetDate
}
/**
 * Helper to format date as mm-yyyy
 *
 * @param date      Date to format
 * @returns         mm-yyyy
 */
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * Helper to sort periods (mm-yyyy) by date, earliest first, excluding 'total'.
 */
function sortPeriods(periods: string[]): string[] {
  return periods
    .filter((p) => p !== 'total')
    .sort((a, b) => {
      const [aMonth, aYear] = a.split('-').map(Number)
      const [bMonth, bYear] = b.split('-').map(Number)
      if (aYear !== bYear) return aYear - bYear
      return aMonth - bMonth
    })
}

/**
 * Helper to get array of filtered transactions for a given period and optional
 * filters on cat_group_id and account_id.
 */
function getTransactionsForPeriod(
  period: string,
  startDate: Date,
  endDate: Date,
  options?: { cat_group_id?: number; account_id?: number | null },
): FlatTransaction[] {
  return flatTransactions.filter((item) => {
    // Filter out transactions before startDate (UTC)
    if (item.date.getTime() < startDate.getTime()) return false
    // Filter out transactions after endDate (UTC)
    if (item.date.getTime() > endDate.getTime()) return false
    // Check if the transaction is in the period
    if (item.period !== period) return false
    // Check if the account is the one we are interested in
    if (options?.account_id !== undefined && item.account_id !== options.account_id) return false
    // Check if the category group is the one we are interested in
    if (options?.cat_group_id !== undefined && item.cat_group_id !== options.cat_group_id) {
      return false
    }
    return true
  })
}

/**
 * Sums the total amounts of all transactions given
 */
const sumTransactionAmounts = (transactions: FlatTransaction[]): number => {
  return transactions.reduce((total, tx) => total + tx.amount, 0)
}

/**
 * Tests
 */

describe('ReportsService', () => {
  test('should return correct period amounts for last 12 months', async () => {
    const startDate = getDateMonthsAgo(11)
    const start = formatDate(startDate)
    const endDate = getDateMonthsAgo(0)
    const end = formatDate(endDate)
    TestLogger.info(`Running Report between ${start} and ${end}`)
    const report = await ReportsService.runReport({
      start_date: start,
      end_date: end,
      include_unclassified: false,
    })
    // There should be 12 periods (months) + total
    expect(report.periods.length).toBeGreaterThanOrEqual(13)
    // Check that each period has the expected amount
    const sortedPeriods = sortPeriods(report.periods)
    TestLogger.info(`Sorted periods: ${sortedPeriods.join(', ')}`)

    let testFailed = false
    let totalErrors = 0

    for (const period of sortedPeriods) {
      // Check each top-level category group row
      for (const groupRow of report.rows) {
        // 1. Check group period value matches getTransactionsForPeriod for cat_group_id
        const periodGroupTransactions = getTransactionsForPeriod(period, startDate, endDate, {
          cat_group_id: groupRow.id ?? undefined,
        })
        const expectedGroupAmount = sumTransactionAmounts(periodGroupTransactions)
        try {
          expect(groupRow[period]).toBeCloseTo(expectedGroupAmount, 2)
          TestLogger.info(
            `${'\x1b[32m'}Group ${groupRow.id} for period ${period} Passed${'\x1b[0m'}`,
          )
        } catch (_err) {
          totalErrors++
          TestLogger.info(
            `${'\x1b[31m'}Group ${groupRow.id} for period ${period} Failed: expected ${expectedGroupAmount}, got ${groupRow[period]} (Difference: ${Math.abs(Math.abs(expectedGroupAmount) - Math.abs(groupRow[period]))})${'\x1b[0m'}`,
          )
          testFailed = true
        }

        // 2. For each category in the group, check value matches getTransactionsForPeriod for account_id
        let sumCategoryAmounts = 0
        for (const catRow of groupRow.categories ?? []) {
          const periodCatTransactions = getTransactionsForPeriod(period, startDate, endDate, {
            account_id: catRow.id ?? undefined,
          })
          const expectedCatAmount = sumTransactionAmounts(periodCatTransactions)
          try {
            expect(catRow[period]).toBeCloseTo(expectedCatAmount, 2)
            TestLogger.info(
              `\t${'\x1b[32m'}Category ${catRow.id} for period ${period} Passed${'\x1b[0m'}`,
            )
          } catch (_err) {
            totalErrors++
            TestLogger.info(
              `\t${'\x1b[31m'}Category ${catRow.id} for period ${period} Failed: expected ${expectedCatAmount}, got ${catRow[period]} (Difference: ${Math.abs(Math.abs(expectedCatAmount) - Math.abs(catRow[period]))})${'\x1b[0m'}`,
              periodCatTransactions,
            )
            testFailed = true
          }
          sumCategoryAmounts += catRow[period] || 0
        }
        // 3. The sum of all category values for the period matches the group value for the period
        try {
          expect(sumCategoryAmounts).toBeCloseTo(groupRow[period] || 0, 2)
        } catch (_err) {
          totalErrors++
          TestLogger.error(
            `Sum of categories mismatch for period=${period}, cat_group_id=${groupRow.id}: expected ${sumCategoryAmounts}, got ${groupRow[period]} (Difference: ${Math.abs(sumCategoryAmounts) - Math.abs(groupRow[period])})`,
          )
          testFailed = true
        }
      }
    }

    // Finally test if test failed or not
    expect(testFailed, `Report Amounts Did Not Match. Total Errors: ${totalErrors}`).toBe(false)
  })
})
