import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useEffect, useState } from 'react'

/**
 * React-Query Hook to get Book from the database.
 *
 * @returns       book (IBook | null), isLoading (boolean), error (Error | null)
 */
export const useGetAppState = (_request: AppCommandRequest<AppCommandIds.GET_APP_STATE>) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['appState'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.GET_APP_STATE)
      return result
    },
  })
  useEffect(() => {
    if (data) {
      setIsInitialised(true)
    }
  }, [data, setIsInitialised])

  return {
    book: data?.book,
    isAuthenticated: data?.authenticated,
    authenticatedUser: data?.authenticatedUser,
    userSettings: data?.userSettings,
    isInitialised,
    isLoading,
    error,
  }
}
