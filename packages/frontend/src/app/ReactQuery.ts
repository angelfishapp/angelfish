import { QueryClient } from '@tanstack/react-query'

import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React Query Client Config for the application.
 * this will handle to keep the cache for the data in the application.
 * this will also handle the refetching of the data when the window is focused.
 */
export const AppReactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity, // this will make sure cache is not removed collected
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * React Query Keys for the application to be used in React Query hooks.
 * This will help to keep the cache organized and avoid conflicts.
 */
export const APP_QUERY_KEYS = {
  ACCOUNTS: ['accounts'],
  QUERY_ACCOUNTS: (query: AppCommandRequest<AppCommandIds.LIST_ACCOUNTS>) => ['accounts', query],
  APPSTATE: ['appState'],
  BOOK: ['book'],
  CATEGORY_GROUPS: ['categoryGroups'],
  INSTITUTIONS: ['institutions'],
  REPORTS: (query: AppCommandRequest<AppCommandIds.RUN_REPORT>) => ['reports', query],
  SEARCH_INSTITUTIONS: (query: string) => ['searchInstitutions', query],
  TAGS: ['tags'],
  TRANSACTIONS: ['transactions'],
  QUERY_TRANSACTIONS: (query: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>) => [
    'transactions',
    query,
  ],
  USERS: ['users'],
}
