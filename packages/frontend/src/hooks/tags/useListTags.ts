import { useQuery } from '@tanstack/react-query'

import { listTags } from '@/api'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that lists all Tags in the Database
 *
 * @returns tags (ITag[]), isLoading (boolean), error (Error or null)
 */
export const useListTags = (_request: AppCommandRequest<AppCommandIds.LIST_TAGS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => listTags(),
  })

  return { tags: data ?? [], isLoading, error }
}
