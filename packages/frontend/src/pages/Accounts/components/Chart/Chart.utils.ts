import moment from 'moment'

import type { ITransaction } from '@angelfish/core'

/**
 * Process transactions to generate running balance for Chart. Will
 * display the maximum balance for the each month.
 *
 * @param transactions  The transactions array for an Account
 * @param start_balance The starting balance of the account
 * @returns             Object with array of chart data
 */
export function getChartData(
  transactions: ITransaction[],
  start_balance = 0,
): { balance: number[]; labels: string[] } {
  const chartData: Record<string, number> = {}

  // Sort by Date to ensure running balance is correct
  const sortedTransactions = transactions
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Generate month labels between first transaction date and current date
  const startDate = moment(sortedTransactions[0]?.date)
  const endDate = moment(new Date())
  while (startDate.isBefore(endDate)) {
    chartData[startDate.format('MMM-YY')] = 0
    startDate.add(1, 'month')
  }
  // Make sure current month is included if startDate goes past
  if (!(endDate.format('MMM-YY') in chartData)) {
    chartData[endDate.format('MMM-YY')] = 0
  }

  // Calculate Running Balance
  let currentBalance = start_balance
  sortedTransactions.forEach((transaction, index) => {
    currentBalance += transaction.amount

    const month = moment(transaction.date).format('MMM-YY')

    // Will display maximum balance for the month
    if (month in chartData && !chartData[month]) {
      chartData[month] = currentBalance
    } else if (month in chartData && currentBalance != chartData[month]) {
      if (currentBalance < 0 && chartData[month] < 0) {
        // The greatest negative number should be displayed
        if (currentBalance < chartData[month]) {
          chartData[month] = currentBalance
        }
      } else if (currentBalance > chartData[month]) {
        // Show the highest balance if positive
        chartData[month] = currentBalance
      }
    }

    // If transactions finish before current date, need to make sure
    // rest of months match balance of last transaction
    if (index == sortedTransactions.length - 1) {
      const transactionDate = moment(transaction.date)
      if (transactionDate.isBefore(endDate)) {
        transactionDate.add(1, 'month')
        if (transactionDate.format('MMM-YY') in chartData) {
          chartData[transactionDate.format('MMM-YY')] = currentBalance
        }
      }
    }
  })

  // Convert balances to array
  const balance: number[] = []
  let lastKey = ''
  for (const key in chartData) {
    if (chartData[key]) {
      balance.push(chartData[key])
      lastKey = key
    } else {
      // Take previous month balance
      balance.push(chartData[lastKey])
    }
  }

  // Return labels/balance
  return {
    balance,
    labels: Object.keys(chartData),
  }
}
