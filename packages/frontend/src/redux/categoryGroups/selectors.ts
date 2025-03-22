/**
 * Selectors to get data from Store
 */
import type { ICategoryGroup } from '@angelfish/core'
import type { RootState } from '../reducers'

/**
 * Fetches all the CategoryGroups in the Store
 */
export const selectAllCategoryGroups = (state: RootState) =>
  state.categoryGroups as ICategoryGroup[]
