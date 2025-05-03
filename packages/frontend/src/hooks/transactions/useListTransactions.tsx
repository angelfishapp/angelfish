import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest, ITransaction } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

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
 * @returns       data (ITransaction[]), isLoading (booelan), error (Error or null)
 */
export const useListTransactions = (query: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', query],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_TRANSACTIONS, query)
      return result
    },
    enabled: !!query.account_id || !!query.start_date || !!query.end_date,
  })

  return { data, isLoading, error } as { data: ITransaction[]; isLoading: boolean; error: any }
}
