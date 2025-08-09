import type { Table } from '@tanstack/react-table'

import { handleKeyboardSelection } from '@/components/Table'
import type { TransactionRow } from '@/components/TransactionsTable/data'

/**
 * Handle keyboard shortcuts for the Transactions Table
 *
 * CMND/CTRL + C: Copy (Duplicate) selected rows
 * CMND/CTRL + R: Mark selected rows as reviewed
 * Enter: Edit selected row
 *
 * @param event    The keyboard event
 * @param table    The Transactions Table instance
 * @param onDelete Callback function to delete selected transactions
 */
export function handleKeyboardShortcuts(
  event: React.KeyboardEvent,
  table: Table<TransactionRow>,
  onDelete: () => void,
) {
  // Prevent default for navigation and action keys
  const key = event.key
  const isModifierPressed = event.ctrlKey || event.metaKey
  if (
    key === 'ArrowUp' ||
    key === 'ArrowDown' ||
    key === 'Enter' ||
    key === 'Delete' ||
    key === 'Backspace' ||
    (isModifierPressed && (key === 'c' || key === 'r'))
  ) {
    event.preventDefault()
    event.stopPropagation()
  }

  const selectedRows = table.getSelectedRowModel().rows

  switch (key) {
    case 'ArrowUp':
      handleKeyboardSelection(event, table)
      break
    case 'ArrowDown':
      handleKeyboardSelection(event, table)
      break
    case 'c':
    case 'C':
      // Copy (Duplicate) Selected Rows
      if (isModifierPressed && selectedRows.length > 0) {
        table.options.meta?.transactionsTable?.duplicateRows(
          selectedRows.map((row) => row.original),
        )
      }
      break
    case 'r':
    case 'R':
      // Mark Selected Rows as Reviewed
      if (isModifierPressed && selectedRows.length > 0) {
        const rows = selectedRows.map((row) => row.original)
        table.options.meta?.transactionsTable?.updateRows(rows, { is_reviewed: true })
      }
      break
    case 'Delete':
    case 'Backspace':
      if (selectedRows.length > 0) {
        // Show Delete Confirmation Dialog
        onDelete()
      }

      break
    case 'Enter':
      // Edit Selected Row
      if (selectedRows.length === 1) {
        const row = selectedRows[0]
        table.options.meta?.transactionsTable?.toggleEditMode(row.id, true)
      }
      break
  }
}
