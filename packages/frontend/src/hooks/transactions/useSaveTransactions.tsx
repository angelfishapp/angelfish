import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ITransactionUpdate } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * TODO - Add a description
 * @returns
 */
export const useSaveTransactions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactions: ITransactionUpdate[]) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_TRANSACTIONS, transactions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
