import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of Transactions objects (ITransaction[]).
 */
export async function listTransactions(
  request: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_TRANSACTIONS, request)
}

/**
 * Save an account to the database. This can be used to create a new Transaction
 * or update an existing one.
 *
 * @param request   ITransactionUpdate object containing the Transaction data to save.
 * @returns         The saved Transaction object (ITransaction).
 */
export async function saveTransaction(request: AppCommandRequest<AppCommandIds.SAVE_TRANSACTIONS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_TRANSACTIONS, request)
}

/**
 * Delete an Transaction to the database.
 *
 * @param request   The ID of the Transaction to delete.
 */
export async function deleteTransaction(
  request: AppCommandRequest<AppCommandIds.DELETE_TRANSACTION>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.DELETE_TRANSACTION, request)
}
