import { useQuery } from '@tanstack/react-query'

import { listTransactions } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'

/**
 * React-Query Hook that lists Transactions for a given query
 *
 * @param query   Query object with following properties:
 *                 - account_id: ID of the Account to list Transactions for
 *                 - cat_id: ID of the Category to filter Transactions by
 *                 - cat_group_id: ID of the Category Group to filter Transactions by
 *                 - start_date: Start date to filter Transactions by
 *                 - end_date: End date to filter Transactions by
 *                 - requires_sync: Whether to only list Transactions that require sync
 *                 - currency_code: ISO 4217 currency code to filter Transactions by
 * @returns       transactions (ITransaction[]), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useListTransactions = (query: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: APP_QUERY_KEYS.QUERY_TRANSACTIONS(query),
    queryFn: async () => listTransactions(query),
  })

  return { transactions: data ?? [], isLoading, isFetching, error }
}
