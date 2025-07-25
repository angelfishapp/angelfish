import type React from 'react'
import { useCallback, useEffect, useRef } from 'react'

import type { TransactionRow } from '@/components/TransactionsTable/data'
import type { Table as ReactTable } from '@tanstack/react-table'

/**
 * Configuration for the `useKeyboardShortcuts` custom hook.
 */
interface KeyboardShortcutsConfig {
  /**
   * The TanStack table instance managing the transactions table.
   */
  table: ReactTable<TransactionRow> | undefined

  /**
   * Callback to trigger when the user confirms deletion using Delete or Backspace.
   * Called with the currently selected transactions.
   */
  onDeleteConfirm: (rows: TransactionRow[]) => void

  /**
   * Callback to trigger when the user duplicates selected transactions (Ctrl/Cmd + C).
   */
  onDuplicate: (rows: TransactionRow[]) => void

  /**
   * Callback to trigger when the user inserts a new transaction (Shift + N).
   * Optionally receives the currently selected row’s date.
   */
  onInsertNew: (date?: Date) => void

  /**
   * Callback to toggle the "reviewed" state of selected transactions (Ctrl/Cmd + R).
   */
  onToggleReviewed: (rows: TransactionRow[]) => void

  /**
   * Whether keyboard shortcuts are currently enabled. Defaults to true.
   */
  isEnabled?: boolean
}

/**
 * Custom React hook to enable keyboard shortcuts for a transactions table UI.
 *
 * Supported keyboard shortcuts:
 * - Arrow Up/Down: Navigate and select rows (supports shift for multi-select)
 * - Ctrl/Cmd + C: Duplicate selected rows
 * - Ctrl/Cmd + R: Toggle "reviewed" state for selected rows
 * - Shift + N: Insert a new transaction (optionally using selected row's date)
 * - Delete / Backspace: Confirm deletion of selected rows
 *
 * Automatically prevents default browser behavior for the above keys.
 * Skips shortcuts when the user is focused on an input, textarea, or contenteditable element.
 *
 * @param {KeyboardShortcutsConfig} config - Configuration object for the hook
 */

export function useKeyboardShortcuts({
  table,
  onDeleteConfirm,
  onDuplicate,
  onInsertNew,
  onToggleReviewed,
  isEnabled = true,
}: KeyboardShortcutsConfig) {
  // Keep track of selection state for multi-selection
  const selectionStateRef = useRef<{
    anchor: string | null
    lastDirection: 'up' | 'down' | null
  }>({
    anchor: null,
    lastDirection: null,
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
      const selectedRows = table.getSelectedRowModel().rows
      const allRows = table.getRowModel().rows.filter((row) => row.depth === 0)

      // Prevent default behavior for our shortcuts
      const shouldPreventDefault = () => {
        if (key === 'ArrowUp' || key === 'ArrowDown') return true
        if (isModifierPressed && (key === 'c' || key === 'r')) return true
        if (shiftKey && key.toLowerCase() === 'n') return true
        if (key === 'Delete' || key === 'Backspace') return true
        return false
      }

      if (shouldPreventDefault()) {
        event.preventDefault()
        event.stopPropagation()
      }

      switch (key) {
        case 'ArrowUp':
          handleArrowNavigation('up', shiftKey, table, allRows, selectedRows, selectionStateRef)
          break

        case 'ArrowDown':
          handleArrowNavigation('down', shiftKey, table, allRows, selectedRows, selectionStateRef)
          break

        case 'c':
        case 'C':
          if (isModifierPressed && selectedRows.length > 0) {
            onDuplicate(selectedRows.map((row) => row.original))
          }
          break

        case 'n':
        case 'N':
          if (shiftKey && !isModifierPressed) {
            const currentDate =
              selectedRows.length > 0
                ? new Date(selectedRows[0].original.transaction.date)
                : new Date()
            onInsertNew(currentDate)
          }
          break

        case 'r':
        case 'R':
          if (isModifierPressed && selectedRows.length > 0) {
            onToggleReviewed(selectedRows.map((row) => row.original))
          }
          break

        case 'Delete':
        case 'Backspace':
          if (selectedRows.length > 0) {
            onDeleteConfirm(selectedRows.map((row) => row.original))
          }
          break
      }
    },
    [table, onDeleteConfirm, onDuplicate, onInsertNew, onToggleReviewed, isEnabled],
  )

  useEffect(() => {
    if (!isEnabled) return

    // Use capture phase and add to window to catch all events
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown, isEnabled])
}

function handleArrowNavigation(
  direction: 'up' | 'down',
  shiftKey: boolean,
  table: ReactTable<TransactionRow>,
  allRows: any[],
  selectedRows: any[],
  selectionStateRef: React.MutableRefObject<{
    anchor: string | null
    lastDirection: 'up' | 'down' | null
  }>,
) {
  if (allRows.length === 0) return

  let targetIndex = 0

  if (selectedRows.length > 0) {
    // Find the current selection boundary based on direction
    let currentIndex: number

    if (shiftKey && selectionStateRef.current.anchor) {
      // Multi-selection mode - find the boundary to extend from
      if (direction === 'up') {
        // Find the topmost selected row
        const topRowId = selectedRows.reduce((topRow, row) => {
          const topIndex = allRows.findIndex((r) => r.id === topRow.id)
          const currentIndex = allRows.findIndex((r) => r.id === row.id)
          return currentIndex < topIndex ? row : topRow
        }).id
        currentIndex = allRows.findIndex((row) => row.id === topRowId)
        targetIndex = Math.max(0, currentIndex - 1)
      } else {
        // Find the bottommost selected row
        const bottomRowId = selectedRows.reduce((bottomRow, row) => {
          const bottomIndex = allRows.findIndex((r) => r.id === bottomRow.id)
          const currentIndex = allRows.findIndex((r) => r.id === row.id)
          return currentIndex > bottomIndex ? row : bottomRow
        }).id
        currentIndex = allRows.findIndex((row) => row.id === bottomRowId)
        targetIndex = Math.min(allRows.length - 1, currentIndex + 1)
      }
    } else {
      // Single selection or starting new multi-selection
      const currentRowId = selectedRows[selectedRows.length - 1].id
      currentIndex = allRows.findIndex((row) => row.id === currentRowId)

      if (direction === 'up') {
        targetIndex = Math.max(0, currentIndex - 1)
      } else {
        targetIndex = Math.min(allRows.length - 1, currentIndex + 1)
      }
    }
  } else {
    // No selection, start from top or bottom
    targetIndex = direction === 'up' ? allRows.length - 1 : 0
    selectionStateRef.current.anchor = null
  }

  const targetRow = allRows[targetIndex]
  if (!targetRow) return

  if (shiftKey && selectedRows.length > 0) {
    // Multi-select mode
    // Set anchor if not already set (first shift+arrow press)
    if (!selectionStateRef.current.anchor) {
      selectionStateRef.current.anchor = selectedRows[0].id
    }

    const anchorIndex = allRows.findIndex((row) => row.id === selectionStateRef.current.anchor)

    // Calculate the new selection range
    let startIndex: number
    let endIndex: number

    if (direction === 'up') {
      // Extending upward
      const currentTopIndex = Math.min(
        ...selectedRows.map((row) => allRows.findIndex((r) => r.id === row.id)),
      )
      startIndex = Math.min(targetIndex, anchorIndex)
      endIndex = Math.max(anchorIndex, currentTopIndex)

      // If we're going up from anchor, extend the selection upward
      if (targetIndex < anchorIndex) {
        startIndex = targetIndex
        endIndex = anchorIndex
      } else {
        // We're contracting from below
        startIndex = targetIndex
        endIndex = anchorIndex
      }
    } else {
      // Extending downward
      const currentBottomIndex = Math.max(
        ...selectedRows.map((row) => allRows.findIndex((r) => r.id === row.id)),
      )
      startIndex = Math.min(anchorIndex, currentBottomIndex)
      endIndex = Math.max(targetIndex, anchorIndex)

      // If we're going down from anchor, extend the selection downward
      if (targetIndex > anchorIndex) {
        startIndex = anchorIndex
        endIndex = targetIndex
      } else {
        // We're contracting from above
        startIndex = anchorIndex
        endIndex = targetIndex
      }
    }

    const newSelection: Record<string, boolean> = {}
    for (let i = startIndex; i <= endIndex; i++) {
      if (allRows[i]) {
        newSelection[allRows[i].id] = true
      }
    }

    table.setRowSelection(newSelection)
    selectionStateRef.current.lastDirection = direction
  } else {
    // Single select mode - reset selection state
    selectionStateRef.current.anchor = targetRow.id
    selectionStateRef.current.lastDirection = null
    table.setRowSelection({
      [targetRow.id]: true,
    })
  }

  // Scroll to the selected row
  scrollToRow(targetRow.id)
}

function scrollToRow(rowId: string) {
  // Find the row element and scroll it into view
  const rowElement = document.querySelector(`[data-row-id="${rowId}"]`)
  if (rowElement) {
    rowElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}
