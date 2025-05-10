import type { IUser } from '@angelfish/core'

/**
 * UserTableUIContainer Properties
 */
export interface UserTableUIContainerProps {
  /**
   * List of 100x100 PNG Base54 encoded Avatars
   * user can select for a user
   */
  avatars: string[]
  /**
   * Set the Cloud ID of the authenticated user
   * to prevent current user deleting themselves
   */
  authenticated_user_id: string
  /*
   * The current users in database
   */
  users: IUser[]
  /**
   * Callback function to delete an existing user
   */
  onDelete: (user: IUser) => void
  /*
   * Callback function to edit a user
   */
  onSave: (user: IUser) => void
}
