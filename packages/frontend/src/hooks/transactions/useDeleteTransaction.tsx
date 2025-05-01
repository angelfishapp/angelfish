import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Custom React Query hook to delete a transaction.
 *
 * This hook uses `useMutation` to perform the `DELETE_TRANSACTION` command through the Angelfish `CommandsClient`.
 * On success, it invalidates the cached `'accounts'` query to ensure fresh data is fetched.
 *
 * @returns {object} - Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      CommandsClient.executeAppCommand(AppCommandIds.DELETE_TRANSACTION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
