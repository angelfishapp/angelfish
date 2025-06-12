import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveBook } from '@/api/book'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { IFrontEndAppState } from '@/hooks/app'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import { DEFAULT_APP_STATE } from '../app/useGetAppState'

/**
 * React-Query Hook to update the Book.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveBook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_BOOK>) => saveBook(request),
    onSuccess: (book) => {
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
}
