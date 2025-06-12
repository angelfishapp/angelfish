import { useQuery } from '@tanstack/react-query'

import { listInstitutions } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import { useGetBook } from '../book'

/**
 * React-Query Hook that lists Institutions
 *
 * @param query   Query object with following properties:
 *                 -account_class:the class of the account to fillter by and has 2 valuse 'CATEGORY' or 'ACCOUNT'
 *                 -category_group_id: ID of the Category Group to filter Accounts by
 *                 -institution_id: ID of the institution to filter Accounts by
 *
 * @returns       data (IInstitution[]), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useListInstitutions = (
  _request: AppCommandRequest<AppCommandIds.LIST_INSTITUTIONS>,
) => {
  const { book } = useGetBook()
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: APP_QUERY_KEYS.INSTITUTIONS,
    queryFn: async () => listInstitutions(),
    enabled: !!book, // Only run if book is open
  })

  return { institutions: data ?? [], isLoading, isFetching, error }
}
