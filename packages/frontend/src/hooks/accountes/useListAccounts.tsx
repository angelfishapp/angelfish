import { useQuery } from '@tanstack/react-query'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import type { IAccount } from '@angelfish/core/src/types'

/**
 * React-Query Hook that lists Accounts for a given query
 *
 * @param query   Query object with following properties:
 *                 -account_class:the class of the account to fillter by and has 2 valuse 'CATEGORY' or 'ACCOUNT'
 *                 -category_group_id: ID of the Category Group to filter Accounts by
 *                 -institution_id: ID of the institution to filter Accounts by
 *
 * @returns       data (IAccount[]), isLoading (booelan), error (Error or null)
 */
export const useListAccounts = (query: AppCommandRequest<AppCommandIds.LIST_ACCOUNTS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts', query],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_ACCOUNTS, query)
      return result
    },
  })

  return { data, isLoading, error } as { data: IAccount[]; isLoading: boolean; error: Error | null }
}
