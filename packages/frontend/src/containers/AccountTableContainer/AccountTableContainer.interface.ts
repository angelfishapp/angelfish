import type { AccountTableProps } from '@/components/AccountTable'

/**
 * AccountTableContainer Properties
 */
export interface AccountTableContainerProps {
  /**
   * Group accounts by institution, type, country, or owner
   * @default 'acc_institution'
   */
  groupBy?: AccountTableProps['groupBy']
  /**
   * Optional selected account ID. Will show account highlighted in table
   */
  selectedAccountId?: AccountTableProps['selectedAccountId']
  /**
   * Show closed accounts
   * @default false
   */
  showClosedAccounts?: AccountTableProps['showClosedAccounts']
  /**
   * Sort accounts by name or balance
   * @default 'name'
   */
  sortBy?: AccountTableProps['sortBy']
  /**
   * Callback function to select an account
   */
  onSelectAccount: AccountTableProps['onSelectAccount']
}
