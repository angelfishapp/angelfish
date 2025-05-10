import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Custom React Query hook to delete an account.
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

// Delete Account Action
export type DeleteAccountQueryProps = {
  id: number
  reassignId: number | null
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reassignId }: DeleteAccountQueryProps) =>
      CommandsClient.executeAppCommand(AppCommandIds.DELETE_ACCOUNT, { id, reassignId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
