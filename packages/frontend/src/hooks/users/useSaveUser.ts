import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveUser } from '@/api'
import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'

/**
 * React-Query Hook to save a user.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_USER>) => saveUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
