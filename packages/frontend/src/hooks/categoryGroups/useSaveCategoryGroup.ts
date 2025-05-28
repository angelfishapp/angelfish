import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook to save a Category Group.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useSaveCategoryGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.SAVE_CATEGORY_GROUP>) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_CATEGORY_GROUP, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryGroups'] })
    },
  })
}
