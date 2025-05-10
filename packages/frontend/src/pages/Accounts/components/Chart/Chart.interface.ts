import type { IAccount, ITransaction } from '@angelfish/core'

/**
 * Chart Component Properties
 */

export interface ChartProps {
  /**
   * Bank Account Transactions belong too
   */
  account: IAccount
  /**
   * Data points to render
   */
  transactions: ITransaction[]
}
