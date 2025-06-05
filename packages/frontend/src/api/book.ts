import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of book objects (IBook[]).
 */
export async function getBook(_request: AppCommandRequest<AppCommandIds.GET_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_BOOK)
}

/**
 * Save an account to the database. This can be used to create a new Book
 * or update an existing one.
 *
 * @param request   IBookUpdate object containing the Book data to save.
 * @returns         The saved Book object (IBook).
 */
export async function saveBook(request: AppCommandRequest<AppCommandIds.SAVE_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_BOOK, request)
}
