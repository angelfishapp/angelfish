import type { IAccount, IInstitution } from '@angelfish/core'

/**
 * AccountTable Properties
 */
export interface AccountTableProps {
  /**
   * The bank Accounts in database with relations loaded
   */
  accountsWithRelations: IAccount[]
  /**
   * Default currency for the book
   */
  book_default_currency: string
  /**
   * Optionally disable table context menu
   * @default false
   */
  disableContextMenu?: boolean
  /*
   * The Institutions in database
   */
  institutions: IInstitution[]
  /**
   * Group accounts by institution, type, country, or owner
   * @default 'acc_institution'
   */
  groupBy?: 'acc_institution' | 'acc_type' | 'acc_country' | 'acc_owners' | 'acc_currency'
  /**
   * Optional selected account ID. Will show account highlighted in table
   */
  selectedAccountId?: number
  /**
   * Show closed accounts
   * @default false
   */
  showClosedAccounts?: boolean
  /**
   * Sort accounts by name or balance
   * @default 'name'
   */
  sortBy?: 'name' | 'current_balance'
  /**
   * Callback function for when Bank Account is selected
   */
  onSelectAccount: (account?: IAccount) => void
  /**
   * Callback function to create a new Bank Account.
   * Optionally pass an Institution to pre-select the Institution
   * in the form
   */
  onCreateAccount: (institution?: IInstitution) => void
  /**
   * Callback function to edit a Bank Account
   */
  onEditAccount: (account: Partial<IAccount>) => void
  /**
   * Callback function to delete a Bank Account
   */
  onDeleteAccount: (account: IAccount) => void
  /**
   * Callback function for when Institution is selected
   */
  onSelectInstitution: (institution?: IInstitution) => void
  /**
   * Callback function to create a new Institution
   */
  onCreateInstitution: () => void
  /**
   * Callback function to edit an Institution
   */
  onEditInstitution: (institution: IInstitution) => void
  /**
   * Callback function to delete an Institution
   */
  onDeleteInstitution: (institution: IInstitution) => void
}
