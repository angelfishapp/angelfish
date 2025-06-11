import { useQuery } from '@tanstack/react-query'

import { listTags } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that lists all Tags in the Database
 *
 * @returns tags (ITag[]), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useListTags = (_request: AppCommandRequest<AppCommandIds.LIST_TAGS>) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: APP_QUERY_KEYS.TAGS,
    queryFn: async () => listTags(),
  })

  return { tags: data ?? [], isLoading, isFetching, error }
}
