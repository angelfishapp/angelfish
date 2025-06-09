import { queryClient } from '@/providers'
import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Retrieves a list of all users from the database.
 *
 * @returns A promise that resolves to an array of IUser objects.
 */
export async function listusers(_request: AppCommandRequest<AppCommandIds.LIST_USERS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_USERS)
}

/**
 * Saves a user to the database. Can be used to create or update a user.
 *
 * @param request - The request object containing user data.
 * @returns A promise that resolves to the saved IUser object.
 */
export async function saveUser(request: AppCommandRequest<AppCommandIds.SAVE_USER>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, request)
}

/**
 * Deletes a user from the database.
 *
 * @param request - The request object containing the user ID to delete.
 * @returns A promise that resolves when the user is successfully deleted.
 */
export async function deleteUser(request: AppCommandRequest<AppCommandIds.DELETE_USER>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.DELETE_USER, request)
}

/**
 * Updates the currently authenticated user's details.
 *
 * @param request - The request object containing updated user data.
 * @returns A promise that resolves when the user is successfully updated.
 */
export async function updateUser(
  request: AppCommandRequest<AppCommandIds.UPDATE_AUTHENTICATED_USER>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.UPDATE_AUTHENTICATED_USER, request)
}

/**
 * Logs out the currently authenticated user.
 *
 * @returns A promise that resolves when the user is successfully logged out.
 */
export async function onLogout() {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
  queryClient.invalidateQueries({ queryKey: ['appState'] })
}

/**
 * Sends an Out-Of-Band (OOB) login code to the user's email.
 *
 * @param email - The user's email address to receive the login code.
 * @throws Error if sending the code fails.
 */
export async function onGetOOBCode(email: string) {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_SEND_OOB_CODE, { email })
  queryClient.invalidateQueries({ queryKey: ['appState'] })
}

/**
 * Authenticates a user using the OOB code received by email.
 *
 * @param oob_code - The OOB code sent to the user's email.
 * @returns A promise that resolves when authentication is successful.
 * @throws Error if authentication fails.
 */
export async function onAuthenticate(oob_code: string) {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_AUTHENTICATE, { oob_code })
}
