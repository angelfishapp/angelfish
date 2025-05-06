import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ITransactionUpdate } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Custom React Query hook to save a transaction.
 *
 * This hook uses `useMutation` to perform the `SAVE_TRANSACTIONS` command through the Angelfish `CommandsClient`.
 * On success, it invalidates the cached `'accounts'` query to ensure fresh data is fetched.
 *
 * @returns {object} - Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveTransactions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactions: ITransactionUpdate[]) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_TRANSACTIONS, transactions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
