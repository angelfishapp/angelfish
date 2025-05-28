import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of users objects (IUser[]).
 */
export async function listusers(_request: AppCommandRequest<AppCommandIds.LIST_USERS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_USERS)
}

/**
 * Save an account to the database. This can be used to create a new User
 * or update an existing one.
 *
 * @param request   IUserUpdate object containing the User data to save.
 * @returns         The saved User object (IUser).
 */
export async function saveUser(request: AppCommandRequest<AppCommandIds.SAVE_USER>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, request)
}

/**
 * Delete an User to the database.
 *
 * @param request   The ID of the User to delete.
 */
export async function deleteUser(request: AppCommandRequest<AppCommandIds.DELETE_USER>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.DELETE_USER, request)
}
