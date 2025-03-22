/**
 * Selectors to get data from Store
 */
import type { IInstitution } from '@angelfish/core'
import type { RootState } from '../reducers'

/**
 * Fetches all the Institutions in the Store
 */
export const selectAllInstitutions = (state: RootState) => state.institutions as IInstitution[]
