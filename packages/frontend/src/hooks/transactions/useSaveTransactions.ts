import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveTransaction } from '@/api'
import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'

/**
 * React-Query Hook to save an array of Transactions to the database.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveTransactions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_TRANSACTIONS>) =>
      saveTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
