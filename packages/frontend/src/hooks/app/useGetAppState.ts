import { useQuery } from '@tanstack/react-query'

import { useAppContext } from '@/providers/AppContext'
import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
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
  const { setBook, setIsAuthenticated, setAuthenticatedUser, setUserSettings } = appContext
  const { data, isLoading, error } = useQuery({
    queryKey: ['book'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
      return result
    },
  })
  useEffect(() => {
    if (data) {
      setBook(data.book)
      setIsAuthenticated(data.authenticated)
      setAuthenticatedUser(data.authenticatedUser)
      setUserSettings(data.userSettings)
    }
  }, [data, setBook, setIsAuthenticated, setAuthenticatedUser, setUserSettings])

  return {
    book: data?.book,
    isAuthenticated: data?.authenticated,
    authenticatedUser: data?.authenticatedUser,
    userSettings: data?.userSettings,
    isLoading,
    error,
  }
}
