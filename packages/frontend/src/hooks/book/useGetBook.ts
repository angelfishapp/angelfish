import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook to get Book from the database.
 *
 * @returns       book (IBook | null), isLoading (boolean), error (Error | null)
 */
export const useGetBook = (_request: AppCommandRequest<AppCommandIds.GET_BOOK>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['book'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.GET_BOOK)
      return result
    },
  })

  return { book: data, isLoading, error }
}
