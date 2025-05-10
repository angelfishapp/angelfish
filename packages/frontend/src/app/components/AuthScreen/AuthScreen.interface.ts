import type React from 'react'

/**
 * AuthScreen Component Properties
 */
export interface AuthScreenProps {
  /**
   * Callback to get OOB code for email address
   */
  onGetOOBCode: (email: string) => Promise<void>
  /**
   * Callback for when user authenticates using the OOB code
   * they received in their email
   */
  onAuthenticate: (oob_code: string) => Promise<void>
  /**
   * Is the current user authenticated (true). If so will show the
   * application otherwise will show the login/signup screen (Default false)
   */
  isAuthenticated?: boolean
  /**
   * Disable the background animations when user is logged into app (underwater)
   * This may be necessary if performance issues with user's computer
   * @default false
   */
  disableBackgroundAnimation?: boolean
  /**
   * React component to render for application screen after login
   */
  children: React.ReactElement<any, any>
}
