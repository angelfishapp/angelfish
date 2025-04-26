import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useMutation,  } from '@tanstack/react-query'

export const useSaveTransactions = () => {

  return useMutation({
    mutationFn: (transactions: any) =>
      CommandsClient.executeAppCommand(AppCommandIds.SAVE_TRANSACTIONS, transactions),

  })
}
