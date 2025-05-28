import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveAccount } from '@/api'
import type { AppCommandRequest } from '@angelfish/core'
import type { AppCommandIds } from '@angelfish/core'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
