import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useMutation } from '@tanstack/react-query'

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: (id: number) =>
      CommandsClient.executeAppCommand(AppCommandIds.DELETE_TRANSACTION, { id }),
  })
}
