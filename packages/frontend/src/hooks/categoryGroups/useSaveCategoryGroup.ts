import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveCategoryGroup } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

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
      saveCategoryGroup(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.CATEGORY_GROUPS })
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.REPORTS })
    },
  })
}
