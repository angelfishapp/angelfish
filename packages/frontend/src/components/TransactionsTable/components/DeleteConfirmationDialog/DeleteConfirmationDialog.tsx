import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { TransactionRow } from '@/components/TransactionsTable/data'
import type { DeleteConfirmationDialogProps } from './DeleteConfirmationDialog.interface'

/**
 * DeleteConfirmationDialog component
 *
 * A modal dialog used to confirm deletion of one or more financial transactions.
 * Displays a warning icon, transaction details (if ≤ 5), and action buttons for canceling or confirming deletion.
 *
 * @example
 * <DeleteConfirmationDialog
 *   isOpen={isModalOpen}
 *   onClose={handleClose}
 *   table={table}
 * />
 */

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  table,
}: DeleteConfirmationDialogProps) {
  const transactions = table?.getSelectedRowModel().rows.map((row) => row.original) || []
  const transactionCount = transactions.length
  const isMultiple = transactionCount > 1

  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      title={`Delete Transaction${isMultiple ? 's' : ''}`}
      confirmText={`Delete ${isMultiple ? transactionCount : 'Transaction'}`}
      onConfirm={() => {
        table?.options.meta?.transactionsTable?.deleteRows(transactions)
        onClose()
      }}
      confirmButtonColor="error"
    >
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete{' '}
        {isMultiple ? `these ${transactionCount} transactions` : 'this transaction'}? This action
        cannot be undone.
      </Typography>
      {transactionCount <= 5 && (
        <Box mt={2}>
          <Typography variant="subtitle2">Transactions to be deleted:</Typography>
          <Box mt={1} maxHeight={150} overflow="auto">
            {transactions.map((transaction: TransactionRow) => (
              <Box
                key={transaction?.tid}
                sx={{
                  bgcolor: 'action.hover',
                  p: 1.5,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2">
                  {transaction.transaction.title || 'Untitled'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(transaction.transaction.date).toLocaleDateString()} •{' '}
                  {transaction.transaction.amount > 0 ? '+' : ''}
                  {transaction.transaction.amount.toFixed(2)}{' '}
                  {transaction.transaction.currency_code}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </ConfirmDialog>
  )
}
