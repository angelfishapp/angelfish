import { useQuery } from '@tanstack/react-query'

import { getBook } from '@/api/book'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to get Book from the database.
 *
 * @returns       book (IBook | null), isLoading (boolean), error (Error | null)
 */
export const useGetBook = (_request: AppCommandRequest<AppCommandIds.GET_BOOK>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['book'],
    queryFn: async () => getBook(),
  })

  return { book: data, isLoading, error }
}
