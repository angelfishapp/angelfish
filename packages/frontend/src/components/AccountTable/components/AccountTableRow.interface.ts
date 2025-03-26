import type { Row } from '@tanstack/react-table'

import type { IInstitution } from '@angelfish/core'
import type { AccountTableRow } from '../AccountTable.data'
import type { AccountTableProps } from '../AccountTable.interface'

/**
 * Account Table Row Properties
 */
export interface AccountTableRowProps {
  /**
   * Default currency for the book
   */
  book_default_currency: AccountTableProps['book_default_currency']
  /**
   * Current GroupBy for Table
   */
  groupBy: AccountTableProps['groupBy']
  /**
   * The Table Row to Render
   */
  row: Row<AccountTableRow>
  /**
   * Optional selected account ID. Will show account highlighted in table
   */
  selectedAccountId?: AccountTableProps['selectedAccountId']
  /**
   * Callback function to create a new Bank Account
   * Optionally pass an Institution to pre-select the Institution
   * in the form
   */
  onCreateAccount: (institution?: IInstitution) => void
  /**
   * Callback function to edit a Bank Account
   * Return undefined to cr
   */
  onEditAccount: (aid?: number) => void
  /**
   * Callback function to edit an Institution
   */
  onEditInstitution: AccountTableProps['onEditInstitution']
  /**
   * Callback function when Account is selected/clicked
   */
  onSelectAccount: (aid: number) => void
}
