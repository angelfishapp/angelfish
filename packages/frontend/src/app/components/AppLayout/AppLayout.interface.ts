import type { IAuthenticatedUser } from '@angelfish/core'

/**
 * AppLayout Component Properties
 */

export interface AppLayoutProps {
  /**
   * Current User logged into app
   */
  authenticatedUser: IAuthenticatedUser
  /**
   * Callback to handle logging out user
   */
  onLogout: () => void
}
