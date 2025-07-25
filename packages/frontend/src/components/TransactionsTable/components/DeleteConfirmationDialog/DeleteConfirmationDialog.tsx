import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

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
 *   onConfirm={handleDelete}
 *   transactions={selectedTransactions}
 * />
 */

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  transactions,
}: DeleteConfirmationDialogProps) {
  const transactionCount = transactions.length
  const isMultiple = transactionCount > 1

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberIcon color="error" />
          <Typography variant="h6">Delete Transaction{isMultiple ? 's' : ''}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete {isMultiple ? `${transactionCount} Transactions` : 'Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
