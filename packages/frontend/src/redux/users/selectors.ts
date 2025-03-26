/**
 * Selectors to get data from Store
 */
import type { RootState } from '../reducers'

/**
 * Select all the Users in the Store
 */
export const selectAllUsers = (state: RootState) => state.users.users
