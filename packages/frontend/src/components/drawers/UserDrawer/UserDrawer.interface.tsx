import type { IUser } from '@angelfish/core'

/**
 * User Draw Component Properties
 */
export interface UserDrawerProps {
  /**
   * Array of Base64 100x100 PNG encoded Avatars User Can Select from
   */
  avatars: string[]
  /**
   * Function triggered when clicking save button
   */
  onSave: (user: IUser) => void
  /**
   * Optional Category, will use these values as initial state of form
   */
  initialValue?: IUser
  /**
   * Show (true) or hide (false) the drawer (Default: true)
   */
  open?: boolean
  /**
   * Function triggered when closing drawer
   */
  onClose?: () => void
}
