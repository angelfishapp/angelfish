import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveInstitution } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'

/**
 * React-Query Hook to save an Institution.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveInstitution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.INSTITUTIONS })
    },
  })
}
