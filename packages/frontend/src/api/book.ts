import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Gets the current book from the database.
 *
 * @returns A promise that resolves with the current book object (IBook).
 */
export async function getBook(_request: AppCommandRequest<AppCommandIds.GET_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_BOOK)
}

/**
 * Updates the current book in the database. Use createBook to create a new book.
 *
 * @param request   Request object containing book data to save (IBookUpdate).
 * @returns         A promise that resolves with the saved book object (IBook).
 */
export async function saveBook(request: AppCommandRequest<AppCommandIds.SAVE_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_BOOK, request)
}
/**
 * Creates a new file for the book and initializes it with the provided details and
 * the current authenticated user.
 *
 * @param filePath  The file path where the book will be saved.
 * @param name      The name of the book.
 * @param country   The ISO-3166-1 alpha-2 country code representing the book's location.
 * @param currency  The default currency code for the book (ISO 4217 format).
 * @param logo      Optional base64-encoded PNG logo for the book.
 * @returns         The newly created book object (IBook).
 */
export async function createBook(request: AppCommandRequest<AppCommandIds.CREATE_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.CREATE_BOOK, request)
}
