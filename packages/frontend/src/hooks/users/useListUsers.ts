import { useQuery } from '@tanstack/react-query'

import { listUsers } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import { useGetBook } from '../book'

/**
 * React-Query Hook that lists Users
 *
 * @param query   Query object with following properties:
 *                 -account_class:the class of the account to fillter by and has 2 valuse 'CATEGORY' or 'ACCOUNT'
 *                 -category_group_id: ID of the Category Group to filter Accounts by
 *                 -institution_id: ID of the institution to filter Accounts by
 *
 * @returns       users (IUser[]), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useListUsers = (_request: AppCommandRequest<AppCommandIds.LIST_USERS>) => {
  const { book } = useGetBook()
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: APP_QUERY_KEYS.USERS,
    queryFn: async () => listUsers(),
    enabled: !!book, // Only run if book is open
  })

  return { users: data ?? [], isLoading, isFetching, error }
}
