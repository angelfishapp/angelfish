import { useQuery } from '@tanstack/react-query'

import { getAppState } from '@/api'
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
    queryKey: ['appState'],
    queryFn: async (): Promise<IFrontEndAppState> => {
      const result = await getAppState()
      // Ensure result is an object and assign required properties for IFrontEndAppState
      const appState: IFrontEndAppState = {
        authenticated: result.authenticated,
        authenticatedUser: result.authenticatedUser,
        book: result.book,
        bookFilePath: result.bookFilePath,
        userSettings: result.userSettings,
        isInitialised: true,
        syncInfo: {
          isSyncing: false,
          success: false,
          durationMs: 0,
          startTime: undefined,
          finishTime: undefined,
          error: undefined,
        },
      }
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
