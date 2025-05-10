/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { IAuthenticatedUserUpdate, IUserUpdate } from '@angelfish/core'

// Update Authenticated User Action
export type UpdateAuthenticatedUserPayload = {
  user: IAuthenticatedUserUpdate
}
export const updateAuthenticatedUser = createAction<UpdateAuthenticatedUserPayload>(
  'users/updateAuthenticatedUser',
)

// Save User Action
export type SaveUserPayload = {
  user: IUserUpdate
}
export const saveUser = createAction<SaveUserPayload>('users/saveUsers')

// Delete User Action
export type DeleteUserPayload = {
  userId: number
}
export const deleteUser = createAction<DeleteUserPayload>('users/deleteUser')
