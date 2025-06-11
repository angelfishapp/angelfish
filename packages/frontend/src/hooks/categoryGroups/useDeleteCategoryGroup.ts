import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteCategoryGroup } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that deletes a categroyGroup with given ID. If reassignId is provided,
 * it will reassign the Account's categroyGroup to the specified Account before deletion.
 *
 * @returns Mutation object from React Query containing:
 *   - `mutate`: function to trigger the mutation
 *   - `data`: response data (if available)
 *   - `isLoading`: boolean indicating if the mutation is in progress
 *   - `error`: error object if the mutation fails
 */
export const useDeleteCategoryGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AppCommandRequest<AppCommandIds.DELETE_CATEGORY_GROUP>) =>
      deleteCategoryGroup(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.CATEGORY_GROUPS })
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.ACCOUNTS })
      queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.REPORTS })
    },
  })
}
