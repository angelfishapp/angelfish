import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the accounts in the database.
 *
 * @returns         An array of CategoryGroups objects (ICategoryGroup[]).
 */
export async function listCategoryGroups(
  _request: AppCommandRequest<AppCommandIds.LIST_CATEGORY_GROUPS>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_CATEGORY_GROUPS)
}

/**
 * Save an account to the database. This can be used to create a new CategoryGroup
 * or update an existing one.
 *
 * @param request   ICategoryGroupUpdate object containing the CategoryGroup data to save.
 * @returns         The saved CategoryGroup object (ICategoryGroup).
 */
export async function saveCategoryGroup(
  request: AppCommandRequest<AppCommandIds.SAVE_CATEGORY_GROUP>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_CATEGORY_GROUP, request)
}

/**
 * Delete an CategoryGroup to the database.
 *
 * @param request   The ID of the CategoryGroup to delete.
 */
export async function deleteCategoryGroup(
  request: AppCommandRequest<AppCommandIds.DELETE_CATEGORY_GROUP>,
) {
  await CommandsClient.executeAppCommand(AppCommandIds.DELETE_CATEGORY_GROUP, request)
}
