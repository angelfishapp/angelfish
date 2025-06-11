import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateAuthenticatedUser } from '@/api'
import type { IFrontEndAppState } from '@/hooks'

/**
 * React-Query Hook to update the current authenticated user.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useUpdateAuthenticatedUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAuthenticatedUser,
    onSuccess: (authenticatedUser) => {
      queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
        ...prevState,
        authenticatedUser,
      }))
    },
  })
}
