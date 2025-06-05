import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteUser } from '@/api'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that deletes a user with the given ID.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.DELETE_USER>) => deleteUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
