import React from 'react'

import {
  onGetFileMappings,
  onImportTransactions,
  onOpenFileDialog,
  onReconcileTransactions,
} from '@/api'
import { ImportTransactions } from '@/components/modals/ImportTransactions'
import { useListAllAccountsWithRelations } from '@/hooks'
import type { ReconciledTransaction } from '@angelfish/core'
import { useQueryClient } from '@tanstack/react-query'
import type { ImportTransactionsContainerProps } from './ImportTransactionsContainer.interface'

/**
 * Container for ImportTransactions Modal
 */
export default function ImportTransactionsContainer({
  defaultAccount,
  open,
  onClose,
}: ImportTransactionsContainerProps) {
  const queryClient = useQueryClient()
  // React-Query Store Data
  const { accounts } = useListAllAccountsWithRelations()

  const onComplete = React.useCallback(
    async (transactions: ReconciledTransaction[]) => {
      await onImportTransactions(transactions)
      queryClient.invalidateQueries({ queryKey: ['accounts'] })

      onClose?.()
    },
    [onClose],
  )

  // Render
  return (
    <ImportTransactions
      defaultAccount={defaultAccount}
      accountsWithRelations={accounts}
      open={open}
      onClose={onClose}
      onOpenFileDialog={onOpenFileDialog}
      onGetFileMappings={onGetFileMappings}
      onReconcileTransactions={onReconcileTransactions}
      onComplete={onComplete}
    />
  )
}
