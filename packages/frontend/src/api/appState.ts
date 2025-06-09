import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Fetches the current application state from the database.
 *
 * Executes the GET_APP_STATE command via the CommandsClient.
 *
 * @param _request - Optional request object for the command (not used currently).
 * @returns A promise that resolves with the application state (structure depends on the backend response).
 */
export async function getAppState(_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
}

