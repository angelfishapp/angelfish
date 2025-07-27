import type { Table as ReactTable, RowSelectionState } from '@tanstack/react-table'
import type React from 'react'
import { useCallback, useEffect, useRef } from 'react'

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

      const { key, metaKey, ctrlKey, shiftKey } = event
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
          handleArrowNavigation('up', shiftKey, table, selectionStateRef)
          break
        case 'ArrowDown':
          handleArrowNavigation('down', shiftKey, table, selectionStateRef)
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

function handleArrowNavigation(
  direction: 'up' | 'down',
  shiftKey: boolean,
  table: ReactTable<TransactionRow>,
  selectionStateRef: React.MutableRefObject<{
    anchorRowId: string | null
    lastSelectedRowId: string | null
  }>,
) {
  const allRows = table.getRowModel().rows
  const selectedRows = table.getSelectedRowModel().rows

  // Find current row to navigate from
  let currentRowId = selectionStateRef.current.lastSelectedRowId
  if (!currentRowId && selectedRows.length > 0) {
    currentRowId = selectedRows[selectedRows.length - 1].id
  }

  let currentRow = allRows.find((row) => row.id === currentRowId)
  let currentLevel = currentRow?.depth ?? 0

  // If no current row, start from first/last row at level 0
  if (!currentRow) {
    const topLevelRows = allRows.filter((row) => row.depth === 0)
    if (topLevelRows.length === 0) return

    currentRow = direction === 'up' ? topLevelRows[topLevelRows.length - 1] : topLevelRows[0]
    currentLevel = 0
  }

  // Get all rows at the same level
  const sameLevel = allRows.filter((row) => row.depth === currentLevel)
  const currentIndex = sameLevel.findIndex((row) => row.id === currentRow!.id)

  if (currentIndex === -1) return

  // Calculate target index
  let targetIndex: number
  if (direction === 'up') {
    targetIndex = Math.max(0, currentIndex - 1)
  } else {
    targetIndex = Math.min(sameLevel.length - 1, currentIndex + 1)
  }

  // If we're at the boundary, don't do anything
  if (targetIndex === currentIndex) return

  const targetRow = sameLevel[targetIndex]
  if (!targetRow) return

  // Update last selected row
  selectionStateRef.current.lastSelectedRowId = targetRow.id

  if (shiftKey) {
    // Multi-select behavior
    let anchorRowId = selectionStateRef.current.anchorRowId

    // If no anchor, use the first selected row or current row as anchor
    if (!anchorRowId) {
      if (selectedRows.length > 0) {
        anchorRowId = selectedRows[0].id
      } else {
        anchorRowId = currentRow.id
      }
      selectionStateRef.current.anchorRowId = anchorRowId
    }

    // Find anchor row in same level
    const anchorIndex = sameLevel.findIndex((row) => row.id === anchorRowId)
    if (anchorIndex === -1) {
      // Anchor not found at same level, reset to current row
      anchorRowId = currentRow.id
      selectionStateRef.current.anchorRowId = anchorRowId
      const newAnchorIndex = sameLevel.findIndex((row) => row.id === anchorRowId)
      if (newAnchorIndex === -1) return
    }

    // Select range from anchor to target
    const finalAnchorIndex = sameLevel.findIndex((row) => row.id === anchorRowId)
    const startIndex = Math.min(finalAnchorIndex, targetIndex)
    const endIndex = Math.max(finalAnchorIndex, targetIndex)

    const newSelection: RowSelectionState = {}
    for (let i = startIndex; i <= endIndex; i++) {
      if (sameLevel[i]) {
        newSelection[sameLevel[i].id] = true
      }
    }

    table.setRowSelection(newSelection)
  } else {
    // Single select - clear previous selection and select target
    selectionStateRef.current.anchorRowId = targetRow.id
    const newSelection: RowSelectionState = {}
    newSelection[targetRow.id] = true
    table.setRowSelection(newSelection)
  }

  // Scroll to target row
  scrollToRow(targetRow.id)
}

function scrollToRow(rowId: string) {
  const rowElement = document.querySelector(`[data-row-id="${rowId}"]`)
  if (rowElement) {
    rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}
