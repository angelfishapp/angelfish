import { useQuery } from '@tanstack/react-query'

import type { ITransaction } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * TODO - Add a description
 * @returns
 */
export const useGetTransactions = (query: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', query],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_TRANSACTIONS, {
        account_id: query,
      })
      return result
    },
  })

  return { data, isLoading, error } as { data: ITransaction[]; isLoading: boolean; error: any }
}
