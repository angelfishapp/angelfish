import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteInstitution } from '@/api'

/**
 * React-Query Hook that deletes an Institution with given ID.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteInstitution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
  })
}
