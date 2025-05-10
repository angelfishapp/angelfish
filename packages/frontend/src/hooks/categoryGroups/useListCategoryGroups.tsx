import { useQuery } from '@tanstack/react-query'

import type { ICategoryGroup } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * React-Query Hook that lists CategoryGroups for a given query
 *
 * @param void   this hook does not take any parameters
 *
 * @returns       data (ICategoryGroup[]), isLoading (booelan), error (Error or null)
 */
export const useListCategoryGroups = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryGroups'],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_CATEGORY_GROUPS)
      return result
    },
  })

  return { data, isLoading, error } as {
    data: ICategoryGroup[]
    isLoading: boolean
    error: Error | null
  }
}
