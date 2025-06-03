import { useQuery } from '@tanstack/react-query'

import { useAppContext } from '@/providers/AppContext'
import type { AppCommandRequest, IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import type { IBook } from '@angelfish/core/src/types'
import { useEffect } from 'react'

/**
 * React-Query Hook to get Book from the database.
 *
 * @returns       book (IBook | null), isLoading (boolean), error (Error | null)
 */
export const useGetAppState = (_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) => {
  const appContext = useAppContext()
  if (!appContext) {
    throw new Error(
      'AppContext is undefined. Please ensure the component is wrapped in AppContextProvider.',
    )
  }

  const { setBook, setIsAuthenticated, setAuthenticatedUser, setUserSettings, setIsInitialised } =
    appContext
  const { data, isLoading, error } = useQuery({
    queryKey: ['appState'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
      return result
    },
  })
  useEffect(() => {
    if (data) {
      setBook(data?.book as IBook)
      setIsAuthenticated(data.authenticated)
      setAuthenticatedUser(data?.authenticatedUser as IAuthenticatedUser)
      setUserSettings(data.userSettings)
      setIsInitialised(true)
    }
  }, [data, setBook, setIsAuthenticated, setAuthenticatedUser, setUserSettings, setIsInitialised])

  return {
    book: data?.book,
    isAuthenticated: data?.authenticated,
    authenticatedUser: data?.authenticatedUser,
    userSettings: data?.userSettings,
    isLoading,
    error,
  }
}
