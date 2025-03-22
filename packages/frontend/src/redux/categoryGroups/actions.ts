/**
 * Public Actions that can be used by UI to interact with Store
 */

import { createAction } from '@reduxjs/toolkit'

import type { ICategoryGroup } from '@angelfish/core'

// Save CategoryGroup Action
export type SaveCategoryGroupPayload = {
  categoryGroup: Partial<ICategoryGroup>
}
export const saveCategoryGroup = createAction<SaveCategoryGroupPayload>(
  'categoryGroups/saveCategoryGroup',
)

// Delete CategoryGroup Action
export type DeleteCategoryGroupPayload = {
  categoryGroupId: number
}
export const deleteCategoryGroup = createAction<DeleteCategoryGroupPayload>(
  'categoryGroups/deleteCategoryGroup',
)
