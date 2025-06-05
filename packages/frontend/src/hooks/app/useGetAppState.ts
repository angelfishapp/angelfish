import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import type { IFrontEndAppState } from './FrontEndAppState.interface'

/**
 * React-Query Hook to get current App Status from the main process.
 *
 * @returns  IFrontEndAppState
 */
export const useGetAppState = (_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) => {
  const {
    data: appState,
    isLoading,
    error,
  } = useQuery<IFrontEndAppState>({
    queryKey: ['appState'],
    queryFn: async (): Promise<IFrontEndAppState> => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
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
    error,
  }
}
