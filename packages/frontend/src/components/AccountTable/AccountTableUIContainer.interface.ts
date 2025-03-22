import type { IAccount, IInstitutionUpdate, IUser } from '@angelfish/core'
import type { AccountTableProps } from '.'
import type { InstitutionDrawerProps } from '../drawers/InstitutionDrawer'

/**
 * AccountTableUIContainer Properties
 */
export interface AccountTableUIContainerProps {
  /**
   * The bank Accounts in database with relations loaded
   */
  accountsWithRelations: AccountTableProps['accountsWithRelations']
  /**
   * Default currency for the book
   */
  book_default_currency: AccountTableProps['book_default_currency']
  /**
   * Optionally disable table context menu
   * @default false
   */
  disableContextMenu?: boolean
  /*
   * The Institutions in database
   */
  institutions: AccountTableProps['institutions']
  /**
   * The Users in the database
   */
  users: IUser[]
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
  /**
   * Callback function to save a Bank Account
   */
  onSaveAccount: (account: Partial<IAccount>) => void
  /**
   * Callback function to delete a Bank Account
   */
  onDeleteAccount: AccountTableProps['onDeleteAccount']
  /**
   * Callback function to save an Institution
   */
  onSaveInstitution: (institution: IInstitutionUpdate) => void
  /**
   * Callback function to delete an Institution
   */
  onDeleteInstitution: AccountTableProps['onDeleteInstitution']
  /**
   * Async Callback to power autocomplete search as user searches
   * remote Institutions from Cloud API
   */
  onSearchInstitutions: InstitutionDrawerProps['onSearch']
}

/**
 * AccountTableContainer Methods
 */
export interface AccountTableMethods {
  /**
   * Open the Bank Account Drawer to add a new Account
   */
  addBankAccount: () => void
  /**
   * Open the Institution Drawer to add a new Institution
   */
  addInstitution: () => void
}
