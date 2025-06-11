import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteAccount } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that deletes an Account with given ID. If reassignId is provided,
 * it will reassign the Account's Transactions to the specified Account before deletion.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.DELETE_ACCOUNT>) =>
      deleteAccount(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.ACCOUNTS })
    },
  })
}
