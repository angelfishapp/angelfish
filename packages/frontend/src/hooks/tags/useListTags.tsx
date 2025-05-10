import { useQuery } from '@tanstack/react-query'

import type { ITag } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook that lists Tags for a given query
 *
 * @param void   this hook does not take any parameters
 *
 * @returns       data (ITag[]), isLoading (booelan), error (Error or null)
 */
export const useListTags = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_TAGS)
      return result
    },
  })

  return { data, isLoading, error } as { data: ITag[]; isLoading: boolean; error: Error | null }
}
