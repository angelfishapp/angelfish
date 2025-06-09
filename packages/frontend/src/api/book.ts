import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Retrieves a list of all books stored in the database.
 *
 * Executes the GET_BOOK command via the CommandsClient.
 *
 * @param _request - Optional request object (currently unused).
 * @returns A promise that resolves with an array of book objects (IBook[]).
 */
export async function getBook(_request: AppCommandRequest<AppCommandIds.GET_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.GET_BOOK)
}

/**
 * Saves a book to the database. This is used for creating a new book or updating an existing one.
 *
 * Executes the SAVE_BOOK command via the CommandsClient.
 *
 * @param request - Request object containing book data to save (IBookUpdate).
 * @returns A promise that resolves with the saved book object (IBook).
 */
export async function saveBook(request: AppCommandRequest<AppCommandIds.SAVE_BOOK>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_BOOK, request)
}
/**
 * Creates a new local book and links it to a cloud account if provided.
 * Opens a native "Save As" dialog in Electron, then creates the book at the specified file path.
 *
 * Executes the CREATE_BOOK command via the CommandsClient.
 *
 * @param filePath - The file path where the book will be saved.
 * @param name - The name of the book.
 * @param country - The ISO-3166-1 alpha-2 country code representing the book's location.
 * @param currency - The default currency code for the book (ISO 4217 format).
 * @param logo - Optional base64-encoded PNG logo for the book.
 * @returns A promise that resolves when the book is created successfully.
 */
export async function createBook(
  filePath: string,
  name: string,
  country: string,
  currency: string,
  logo?: string,
) {
  await CommandsClient.executeAppCommand(AppCommandIds.CREATE_BOOK, {
    filePath,
    book: {
      name,
      country,
      default_currency: currency,
      logo,
      entity: 'HOUSEHOLD',
    },
  })
}

