import type { IAuthenticatedUser } from '@angelfish/core'

/**
 * PrimaryMenu Component Properties
 */
export interface PrimaryMenuProps {
  /**
   * Current User logged into app
   */
  authenticatedUser: IAuthenticatedUser
  /**
   * Callback to handle logging out user
   */
  onLogout: () => void
}
