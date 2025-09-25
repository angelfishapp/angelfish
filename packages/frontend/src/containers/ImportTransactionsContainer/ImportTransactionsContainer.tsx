import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { getFileMappings, importTransactions, reconcileTransactions, showOpenDialog } from '@/api'
import { ImportTransactions } from '@/components/modals/ImportTransactions'
import { useListAllAccountsWithRelations } from '@/hooks'
import type { ReconciledTransaction } from '@angelfish/core'
import type { ImportTransactionsContainerProps } from './ImportTransactionsContainer.interface'

/**
 * Container for ImportTransactions Modal
 */
export default function ImportTransactionsContainer({
  defaultAccount,
  open,
  onClose,
}: ImportTransactionsContainerProps) {
  // React-Query Store Data
  const queryClient = useQueryClient()
  const { accounts } = useListAllAccountsWithRelations()

  // Callback to open the file dialog
  const onOpenFileDialog = React.useCallback(async (multiple: boolean, fileTypes?: string[]) => {
    let extensions: string[] = []
    if (fileTypes && fileTypes.length > 0) {
      extensions = fileTypes.map((type) => type.toUpperCase())
    }
    return await showOpenDialog({
      title: 'Select File Location...',
      properties: multiple ? ['openFile', 'multiSelections'] : ['openFile'],
      filters: [
        {
          name: 'Financial Transactions File',
          extensions,
        },
      ],
    })
  }, [])

  // Calllback to complete the import process
  const onComplete = React.useCallback(
    async (transactions: ReconciledTransaction[]) => {
      await importTransactions(transactions)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      onClose?.()
    },
    [onClose, queryClient],
  )

  // Render
  return (
    <ImportTransactions
      defaultAccount={defaultAccount}
      accountsWithRelations={accounts}
      open={open}
      onClose={onClose}
      onOpenFileDialog={onOpenFileDialog}
      onGetFileMappings={getFileMappings}
      onReconcileTransactions={reconcileTransactions}
      onComplete={onComplete}
    />
  )
}
