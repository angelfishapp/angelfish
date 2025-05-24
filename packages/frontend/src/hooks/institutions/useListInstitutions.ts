import { useQuery } from '@tanstack/react-query'

import { listInstitutions } from '@/api'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that lists Institutions
 *
 * @param query   Query object with following properties:
 *                 -account_class:the class of the account to fillter by and has 2 valuse 'CATEGORY' or 'ACCOUNT'
 *                 -category_group_id: ID of the Category Group to filter Accounts by
 *                 -institution_id: ID of the institution to filter Accounts by
 *
 * @returns       data (IInstitution[]), isLoading (boolean), error (Error or null)
 */
export const useListInstitutions = (
  _request: AppCommandRequest<AppCommandIds.LIST_INSTITUTIONS>,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => listInstitutions(),
  })

  return { institutions: data ?? [], isLoading, error }
}
