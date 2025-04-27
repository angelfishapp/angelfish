import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      CommandsClient.executeAppCommand(AppCommandIds.DELETE_TRANSACTION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
