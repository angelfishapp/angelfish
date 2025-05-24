import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook that lists all CategoryGroups in the Database
 *
 * @returns categoryGroups (ICategoryGroup[]), isLoading (boolean), error (Error or null)
 */
export const useListCategoryGroups = (
  _request: AppCommandRequest<AppCommandIds.LIST_CATEGORY_GROUPS>,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryGroups'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_CATEGORY_GROUPS)
      return result
    },
  })

  return { categoryGroups: data ?? [], isLoading, error }
}
