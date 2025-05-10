/**
 * Selectors to get data from Store
 */
import type { RootState } from '../reducers'

/**
 * Fetches all the Institutions in the Store
 */
export const selectAllInstitutions = (state: RootState) => state.institutions.institutions
