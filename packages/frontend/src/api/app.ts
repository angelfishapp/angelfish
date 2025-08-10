import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Fetches the current application state from the database.
 *
 * @returns The current application state.
 */
export async function getAppLocalization(
  _request: AppCommandRequest<AppCommandIds.GET_LOCALIZATION>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_LOCALIZATION)
}

/**
 * Sends an Out-Of-Band (OOB) login code to the user's email.
 *
 * @param request   The user's email address to receive the login code.
 * @throws          Error if sending the code fails.
 */
export async function onGetOOBCode(request: AppCommandRequest<AppCommandIds.AUTH_SEND_OOB_CODE>) {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_SEND_OOB_CODE, request)
}

/**
 * Authenticates a user using the OOB code received by email.
 *
 * @param request     The OOB code sent to the user's email.
 * @returns           The authenticated IAuthenticatedUser object.
 * @throws            Error if authentication fails.
 */
export async function onAuthenticate(request: AppCommandRequest<AppCommandIds.AUTH_AUTHENTICATE>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.AUTH_AUTHENTICATE, request)
}

/**
 * Updates the currently authenticated user's details.
 *
 * @param request   The request object containing updated user data.
 * @returns         The updated IAuthenticatedUser object.
 */
export async function updateAuthenticatedUser(
  request: AppCommandRequest<AppCommandIds.UPDATE_AUTHENTICATED_USER>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.UPDATE_AUTHENTICATED_USER, request)
}

/**
 * Logs out the currently authenticated user. Will also clear all their refresh tokens across
 * all devices on the Cloud APIs.
 */
export async function onLogout() {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
}
/**
 * Fetches the current application state from the database.
 *
 * @returns The current application state.
 */
export async function getAppState(_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
}
