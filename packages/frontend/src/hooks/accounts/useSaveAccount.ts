import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveAccount } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to save an Account.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_ACCOUNT>) => saveAccount(request),
    onSuccess: (account) => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.ACCOUNTS })
      if (account.class === 'CATEGORY') {
        queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.REPORTS })
      }
    },
  })
}
