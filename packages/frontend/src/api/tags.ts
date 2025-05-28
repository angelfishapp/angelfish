import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of Tags objects (ITag[]).
 */
export async function listTags(_request: AppCommandRequest<AppCommandIds.LIST_TAGS>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_TAGS)
}

/**
 * Save an account to the database. This can be used to create a new Tag
 * or update an existing one.
 *
 * @param request   ITagUpdate object containing the Tag data to save.
 * @returns         The saved Tag object (ITag).
 */
export async function saveTag(request: AppCommandRequest<AppCommandIds.SAVE_TAG>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_TAG, request)
}

/**
 * Delete an Tag to the database.
 *
 * @param request   The ID of the Tag to delete.
 */
export async function deleteTag(request: AppCommandRequest<AppCommandIds.DELETE_TAG>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.DELETE_TAG, request)
}
