/**
 * Selectors to get data from Store
 */

import type { ITag } from '@angelfish/core'
import type { RootState } from '../reducers'

/**
 * Fetches all the Tags in the Store
 */
export const selectAllTags = (state: RootState) => state.tags as ITag[]
