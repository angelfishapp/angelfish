import type { IAccount } from '@angelfish/core'

/**
 * The properties of the AccountsMenu component
 */
export interface AccountsMenuProps {
  /**
   * The function to call when an Account is selected
   */
  onSelectAccount: (account?: IAccount) => void
}
