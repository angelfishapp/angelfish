import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

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
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_BOOK>) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_BOOK, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book'] })
    },
  })
}
