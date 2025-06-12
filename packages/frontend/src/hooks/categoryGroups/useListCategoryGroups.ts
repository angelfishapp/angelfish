import { useQuery } from '@tanstack/react-query'

import { listCategoryGroups } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import { useGetBook } from '../book'

/**
 * React-Query Hook that lists all CategoryGroups in the Database
 *
 * @returns categoryGroups (ICategoryGroup[]), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useListCategoryGroups = (
  _request: AppCommandRequest<AppCommandIds.LIST_CATEGORY_GROUPS>,
) => {
  const { book } = useGetBook()
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: APP_QUERY_KEYS.CATEGORY_GROUPS,
    queryFn: async () => listCategoryGroups(),
    enabled: !!book, // Only run if book is open
  })

  return { categoryGroups: data ?? [], isLoading, isFetching, error }
}
