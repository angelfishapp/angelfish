import type { TransactionRow } from '@/components/TransactionsTable/data'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { DeleteConfirmationModalProps } from './DeleteConfirmationModal.interface'

/**
 * DeleteConfirmationModal component
 *
 * A modal dialog used to confirm deletion of one or more financial transactions.
 * Displays a warning icon, transaction details (if ≤ 5), and action buttons for canceling or confirming deletion.
 *
 * @component
 * @param {DeleteConfirmationModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open or not
 * @param {() => void} props.onClose - Callback to close the dialog
 * @param {() => void} props.onConfirm - Callback when user confirms deletion
 * @param {TransactionRow[]} props.transactions - List of transactions selected for deletion
 *
 * @returns {JSX.Element} Rendered Delete Confirmation modal
 *
 * @example
 * <DeleteConfirmationModal
 *   isOpen={isModalOpen}
 *   onClose={handleClose}
 *   onConfirm={handleDelete}
 *   transactions={selectedTransactions}
 * />
 */

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transactions,
}: DeleteConfirmationModalProps) {
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
