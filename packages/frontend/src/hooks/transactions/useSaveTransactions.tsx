import { AppCommandIds, CommandsClient, ITransactionUpdate } from '@angelfish/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
