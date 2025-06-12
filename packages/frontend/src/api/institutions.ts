import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * List all the Institutions in the database.
 *
 * @returns         An array of Institution objects (IInstitution[]).
 */
export async function listInstitutions(
  _request: AppCommandRequest<AppCommandIds.LIST_INSTITUTIONS>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.LIST_INSTITUTIONS)
}

/**
 * Save an Institution to the database. This can be used to create a new Institution
 * or update an existing one.
 *
 * @param request   IInstitutionUpdate object containing the Institution data to save.
 * @returns         The saved Institution object (IInstitution).
 */
export async function saveInstitution(request: AppCommandRequest<AppCommandIds.SAVE_INSTITUTION>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SAVE_INSTITUTION, request)
}

/**
 * Delete an Institution to the database.
 *
 * @param request   The ID of the Institution to delete.
 */
export async function deleteInstitution(
  request: AppCommandRequest<AppCommandIds.DELETE_INSTITUTION>,
) {
  await CommandsClient.executeAppCommand(AppCommandIds.DELETE_INSTITUTION, request)
}

/**
 * Function to search Institutions based on query string. Uses Cloud API to search
 * over 11k institutions globally.
 *
 * @param query   Search string to search Institutions by
 * @returns       Matching institutions (IInstitutionUpdate[])
 */
export async function onSearchInstitutions(
  request: AppCommandRequest<AppCommandIds.SEARCH_INSTITUTIONS>,
) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SEARCH_INSTITUTIONS, request)
}
