import { useQuery } from '@tanstack/react-query'

import { getAppState } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import type { IFrontEndAppState } from './FrontEndAppState.interface'

/**
 * React-Query Hook to get current App Status from the main process.
 *
 * @returns  IFrontEndAppState, isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useGetAppState = (_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) => {
  const {
    data: appState,
    isLoading,
    isFetching,
    error,
  } = useQuery<IFrontEndAppState>({
    queryKey: APP_QUERY_KEYS.APPSTATE,
    queryFn: async (): Promise<IFrontEndAppState> => {
      const result = await getAppState()
      // Ensure result is an object and assign required properties for IFrontEndAppState
      const appState: IFrontEndAppState = DEFAULT_APP_STATE
      appState.authenticated = result.authenticated ?? false
      appState.authenticatedUser = result.authenticatedUser
      appState.book = result.book
      appState.bookFilePath = result.bookFilePath
      appState.userSettings = result.userSettings ?? DEFAULT_APP_STATE.userSettings
      appState.isInitialised = true
      return appState
    },
  })

  return {
    appState,
    isLoading,
    isFetching,
    error,
  }
}

/**
 * Default App State
 * This is used when the app is not authenticated or has not been initialised.
 */
export const DEFAULT_APP_STATE: IFrontEndAppState = {
  authenticated: false,
  authenticatedUser: undefined,
  book: undefined,
  bookFilePath: undefined,
  isInitialised: false,
  userSettings: { enableBackgroundAnimations: true },
  syncInfo: {
    isSyncing: false,
    success: false,
    durationMs: 0,
    startTime: undefined,
    finishTime: undefined,
    error: undefined,
  },
}
