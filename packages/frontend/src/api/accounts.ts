import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of Accounts objects (IAccount[]).
 */
export async function listAccounts(request: AppCommandRequest<AppCommandIds.LIST_ACCOUNTS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_ACCOUNTS, request)
}

/**
 * Save an account to the database. This can be used to create a new Account
 * or update an existing one.
 *
 * @param request   IAccountUpdate object containing the Account data to save.
 * @returns         The saved Account object (IAccount).
 */
export async function saveAccount(request: AppCommandRequest<AppCommandIds.SAVE_ACCOUNT>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_ACCOUNT, request)
}

/**
 * Delete an Account to the database.
 *
 * @param request   The ID of the Account to delete.
 */
export async function deleteAccount(request: AppCommandRequest<AppCommandIds.DELETE_ACCOUNT>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.DELETE_ACCOUNT, request)
}
