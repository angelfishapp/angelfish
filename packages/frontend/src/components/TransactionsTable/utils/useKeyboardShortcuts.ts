import type { Table as ReactTable } from '@tanstack/react-table'
import { useCallback, useEffect, useRef } from 'react'

import { handleRowSelection } from '@/components/Table'
import type { TransactionRow } from '@/components/TransactionsTable/data'

/**
 * Configuration for the `useKeyboardShortcuts` custom hook.
 */
interface KeyboardShortcutsConfig {
  /**
   * The TanStack table instance managing the transactions table.
   */
  table: ReactTable<TransactionRow> | undefined
  /**
   * Whether keyboard shortcuts are currently enabled. Defaults to true.
   */
  isEnabled?: boolean
  onDeleteConfirm: (transactions: TransactionRow[]) => void
}

/**
 * Custom React hook to enable keyboard shortcuts for a transactions table UI.
 */
export function useKeyboardShortcuts({
  table,
  isEnabled = true,
  onDeleteConfirm,
}: KeyboardShortcutsConfig) {
  // Track selection state for proper multi-select behavior
  const selectionStateRef = useRef<{
    anchorRowId: string | null
    lastSelectedRowId: string | null
  }>({
    anchorRowId: null,
    lastSelectedRowId: null,
  })

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled || !table) return

      const target = event.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true' ||
          target.closest('[contenteditable="true"]'))
      ) {
        return
      }

      const { key, metaKey, ctrlKey } = event
      const isModifierPressed = metaKey || ctrlKey

      // Handle Ctrl+N with aggressive prevention
      if (isModifierPressed && (key === 'n' || key === 'N' || event.keyCode === 78)) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        if (event.returnValue !== undefined) {
          event.returnValue = false
        }

        const selectedRows = table.getSelectedRowModel().rows
        const currentDate =
          selectedRows.length > 0 ? new Date(selectedRows[0].original.transaction.date) : new Date()
        table.options.meta?.transactionsTable?.insertNewRow(currentDate)
        return false
      }

      const selectedRows = table.getSelectedRowModel().rows

      // Prevent default for navigation and action keys
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

      switch (key) {
        case 'ArrowUp':
          handleRowSelection(event, null, table, selectionStateRef, 'up')
          break
        case 'ArrowDown':
          handleRowSelection(event, null, table, selectionStateRef, 'down')
          break
        case 'c':
        case 'C':
          if (isModifierPressed && selectedRows.length > 0) {
            table.options.meta?.transactionsTable?.duplicateRows(
              selectedRows.map((row) => row.original),
            )
          }
          break
        case 'r':
        case 'R':
          if (isModifierPressed && selectedRows.length > 0) {
            const rows = selectedRows.map((row) => row.original)
            table.options.meta?.transactionsTable?.updateRows(rows, { is_reviewed: true })
          }
          break
        case 'Delete':
        case 'Backspace':
          if (selectedRows.length > 0) {
            onDeleteConfirm(selectedRows.map((row) => row.original))
          }

          break
        case 'Enter':
          if (selectedRows.length === 1) {
            const row = selectedRows[0]
            table.options.meta?.transactionsTable?.toggleEditMode(row.id, true)
          }
          break
      }
    },
    [table, isEnabled, onDeleteConfirm],
  )

  // Aggressive Ctrl+N prevention
  useEffect(() => {
    if (!isEnabled) return

    const preventCtrlN = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'n' || event.key === 'N' || event.keyCode === 78 || event.which === 78)
      ) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        if (event.returnValue !== undefined) {
          event.returnValue = false
        }
        return false
      }
    }

    // Add listeners to multiple targets with different phases
    window.addEventListener('keydown', preventCtrlN, { capture: true, passive: false })
    document.addEventListener('keydown', preventCtrlN, { capture: true, passive: false })
    window.addEventListener('keypress', preventCtrlN, { capture: true, passive: false })
    document.addEventListener('keypress', preventCtrlN, { capture: true, passive: false })

    // Main handler
    window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false })

    return () => {
      window.removeEventListener('keydown', preventCtrlN, { capture: true })
      document.removeEventListener('keydown', preventCtrlN, { capture: true })
      window.removeEventListener('keypress', preventCtrlN, { capture: true })
      document.removeEventListener('keypress', preventCtrlN, { capture: true })
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [handleKeyDown, isEnabled])
}
