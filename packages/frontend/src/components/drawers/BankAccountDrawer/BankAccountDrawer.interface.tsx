import type { IAccount, IInstitution, IUser } from '@angelfish/core'

/**
 * Bank Account Drawer Component Properties
 */
export interface BankAccountDrawerProps {
  /**
   * List of available institutions to select from
   */
  institutions: IInstitution[]
  /**
   * Optional Category, will use these values as initial state of form
   */
  initialValue?: Partial<IAccount>
  /**
   * Function triggered when closing drawer
   */
  onClose?: () => void
  /**
   * Function triggered when clicking save button
   */
  onSave: (account: Partial<IAccount>) => void
  /**
   * Show (true) or hide (false) the drawer (Default: true)
   */
  open?: boolean
  /**
   * List of all current users in household that can be assigned as account owners
   */
  users: IUser[]
}
