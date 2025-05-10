import { AppCommandIds, CommandsClient } from '@angelfish/core'
import type { IAccount } from '@angelfish/core/src/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Custom React Query hook to save an account.
 *
 * This hook uses `useMutation` to perform the `SAVE_ACCOUNT` command through the Angelfish `CommandsClient`.
 * On success, it invalidates the cached `'accounts'` query to ensure fresh data is fetched.
 *
 * @returns {object} - Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (account: IAccount) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_ACCOUNT, account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
