import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useQuery } from '@tanstack/react-query'

export const useGetTransactions = (query: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', query],
    queryFn: () => CommandsClient.executeAppCommand(AppCommandIds.LIST_TRANSACTIONS, query),
  })
  return { data, isLoading, error }
}
