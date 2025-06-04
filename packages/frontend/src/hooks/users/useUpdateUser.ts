import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUser } from '@/api'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to update a user.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.UPDATE_AUTHENTICATED_USER>) =>
      updateUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appState'] })
    },
  })
}
