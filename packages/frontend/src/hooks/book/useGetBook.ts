import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getBook } from '@/api/book'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { IFrontEndAppState } from '@/hooks/app'
import { DEFAULT_APP_STATE } from '../app/useGetAppState'

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
    queryKey: APP_QUERY_KEYS.BOOK,
    queryFn: async () => {
      const book = await getBook()
      // Update 'appState' with the book
      queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
        if (!prevState) {
          return {
            ...DEFAULT_APP_STATE,
            book,
          }
        }
        return {
          ...prevState,
          book,
        }
      })
      return book
    },
  })

  return { book, isLoading, isFetching, error }
}
