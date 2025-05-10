import type { IUser } from '@angelfish/core'

/**
 * UserTable Properties
 */
export interface UserTableProps {
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
   * Callback function to create a new User
   */
  onCreate: () => void
  /**
   * Callback function to delete an existing User
   */
  onDelete: (user: IUser) => void
  /*
   * Callback function to edit a User
   */
  onEdit: (user: IUser) => void
}
