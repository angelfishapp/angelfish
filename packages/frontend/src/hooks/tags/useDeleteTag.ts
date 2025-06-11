import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTag } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to delete a Tag by its ID.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.DELETE_TAG>) => deleteTag(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.TAGS })
    },
  })
}
