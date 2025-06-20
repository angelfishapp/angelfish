import { useQuery } from '@tanstack/react-query'

import { onSearchInstitutions } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook to search Institutions based on query string. Calls the Cloud API to search
 * over 11k institutions globally.
 *
 * @param query   Search string to search Institutions by
 *
 * @returns       institutions (IInstitutionUpdate[]), isLoading (boolean), error (Error or null)
 */
export const useSearchInstitutions = ({
  query,
}: AppCommandRequest<AppCommandIds.SEARCH_INSTITUTIONS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: APP_QUERY_KEYS.SEARCH_INSTITUTIONS(query),
    queryFn: async () => {
      return await onSearchInstitutions({ query })
    },
  })

  return { institutions: data ?? [], isLoading, error }
}
