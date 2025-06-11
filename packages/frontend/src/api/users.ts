import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Retrieves a list of all users from the database.
 *
 * @returns  Array of IUser objects representing all users in the Book.
 */
export async function listUsers(_request: AppCommandRequest<AppCommandIds.LIST_USERS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_USERS)
}

/**
 * Saves a user to the database. Can be used to create or update a user.
 *
 * @param request   The IUserUpdate object containing the user data to save.
 * @returns         The saved IUser object.
 */
export async function saveUser(request: AppCommandRequest<AppCommandIds.SAVE_USER>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, request)
}

/**
 * Deletes a user from the database.
 *
 * @param request     The request object containing the user ID to delete.
 */
export async function deleteUser(request: AppCommandRequest<AppCommandIds.DELETE_USER>) {
  await CommandsClient.executeAppCommand(AppCommandIds.DELETE_USER, request)
}
