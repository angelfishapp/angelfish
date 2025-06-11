import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getBook } from '@/api/book'
import type { IFrontEndAppState } from '@/hooks/app'

/**
 * React-Query Hook to get Book from the database.
 *
 * @returns       book (IBook), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useGetBook = () => {
  const queryClient = useQueryClient()
  const {
    data: book,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['book'],
    queryFn: async () => {
      const book = await getBook()
      // Update 'appState' with the book
      queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
        ...prevState,
        book,
      }))
      return book
    },
  })

  return { book, isLoading, isFetching, error }
}
