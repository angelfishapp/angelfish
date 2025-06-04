import { useQuery } from '@tanstack/react-query'

import { listusers } from '@/api'
import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'

/**
 * React-Query Hook that lists Users
 *
 * @param query   Query object with following properties:
 *                 -account_class:the class of the account to fillter by and has 2 valuse 'CATEGORY' or 'ACCOUNT'
 *                 -category_group_id: ID of the Category Group to filter Accounts by
 *                 -institution_id: ID of the institution to filter Accounts by
 *
 * @returns       users (IUser[]), isLoading (booelan), error (Error or null)
 */
export const useListUsers = (_request: AppCommandRequest<AppCommandIds.LIST_USERS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => listusers(),
  })

  return { users: data ?? [], isLoading, error }
}
