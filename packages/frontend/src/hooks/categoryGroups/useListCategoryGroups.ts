import { useQuery } from '@tanstack/react-query'

import { listCategoryGroups } from '@/api'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

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
    queryFn: async () => listCategoryGroups(),
  })

  return { categoryGroups: data ?? [], isLoading, error }
}
