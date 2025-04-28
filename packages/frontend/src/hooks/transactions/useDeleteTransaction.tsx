import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * TODO - Add a description
 * @returns
 */
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
