import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTransaction } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to delete a Transaction by its ID.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.DELETE_TRANSACTION>) =>
      deleteTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.TRANSACTIONS })
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.ACCOUNTS })
    },
  })
}
