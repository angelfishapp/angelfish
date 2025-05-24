import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook that lists all Tags in the Database
 *
 * @returns tags (ITag[]), isLoading (boolean), error (Error or null)
 */
export const useListTags = (_request: AppCommandRequest<AppCommandIds.LIST_TAGS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_TAGS)
      return result
    },
  })

  return { tags: data ?? [], isLoading, error }
}
