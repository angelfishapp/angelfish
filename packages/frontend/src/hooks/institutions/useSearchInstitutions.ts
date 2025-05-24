import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

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
    queryKey: ['searchInstitutions', query],
    queryFn: async () => {
      return await onSearchInstitutions(query)
    },
  })

  return { institutions: data ?? [], isLoading, error }
}

/**
 * Function to search Institutions based on query string. Uses Cloud API to search
 * over 11k institutions globally.
 *
 * @param query   Search string to search Institutions by
 * @returns       Matching institutions (IInstitutionUpdate[])
 */
export async function onSearchInstitutions(query: string) {
  return await CommandsClient.executeAppCommand(AppCommandIds.SEARCH_INSTITUTIONS, { query })
}
