import type { PopoverPosition } from '@mui/material/Popover'
import type { Row, RowSelectionState, Table } from '@tanstack/react-table'
import type { MouseEvent } from 'react'

/**
 * Handle Row Selection. If enableRowSelection is disabled, it will do nothing. If enableMultiRowSelection
 * is disabled, it will only select one row at a time regardless of modifier keys. However if
 * enableMultiRowSelection is enabled, will enable the following modifiers:
 *
 * 1. Click + CMD/CTRL - Select multiple individual rows
 * 2. Click + SHIFT - Range Select multiple rows
 * 3. Single Click - Select only one row
 *
 * @param event   The click event
 * @param row     The row that was clicked
 * @param table   The react-table instance
 */
export function handleRowSelection<T>(
  event: MouseEvent | KeyboardEvent,
  row: Row<T> | null,
  table: Table<T>,
  selectionStateRef?: React.MutableRefObject<{
    anchorRowId: string | null
    lastSelectedRowId: string | null
  }>,
  direction?: 'up' | 'down',
): void {
  // اذا في Arrow Navigation
  if (direction && selectionStateRef) {
    const allRows = table.getRowModel().rows
    const selectedRows = table.getSelectedRowModel().rows

    let currentRowId = selectionStateRef.current.lastSelectedRowId
    if (!currentRowId && selectedRows.length > 0) {
      currentRowId = selectedRows[selectedRows.length - 1].id
    }

    let currentRow = allRows.find((r) => r.id === currentRowId)
    let currentLevel = currentRow?.depth ?? 0

    if (!currentRow) {
      const topLevelRows = allRows.filter((r) => r.depth === 0)
      if (topLevelRows.length === 0) return
      currentRow = direction === 'up' ? topLevelRows[topLevelRows.length - 1] : topLevelRows[0]
      currentLevel = 0
    }

    const sameLevel = allRows.filter((r) => r.depth === currentLevel)
    const currentIndex = sameLevel.findIndex((r) => r.id === currentRow!.id)
    if (currentIndex === -1) return

    const targetIndex =
      direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(sameLevel.length - 1, currentIndex + 1)

    if (targetIndex === currentIndex) return
    const targetRow = sameLevel[targetIndex]
    if (!targetRow) return

    selectionStateRef.current.lastSelectedRowId = targetRow.id

    if ((event as KeyboardEvent).shiftKey) {
      let anchorRowId = selectionStateRef.current.anchorRowId
      if (!anchorRowId) {
        anchorRowId = selectedRows.length > 0 ? selectedRows[0].id : currentRow.id
        selectionStateRef.current.anchorRowId = anchorRowId
      }

      const anchorIndex = sameLevel.findIndex((r) => r.id === anchorRowId)
      const startIndex = Math.min(anchorIndex, targetIndex)
      const endIndex = Math.max(anchorIndex, targetIndex)

      const newSelection: RowSelectionState = {}
      for (let i = startIndex; i <= endIndex; i++) {
        newSelection[sameLevel[i].id] = true
      }
      table.setRowSelection(newSelection)
    } else {
      selectionStateRef.current.anchorRowId = targetRow.id
      const newSelection: RowSelectionState = { [targetRow.id]: true }
      table.setRowSelection(newSelection)
    }

    scrollToRow(targetRow.id)
    return
  }

  // --- Mouse Selection Logic ---
  if (!row) return

  if (table.options.enableRowSelection === false) return

  if (table.options.enableMultiRowSelection === false) {
    table.setRowSelection({ [row.id]: true })
    return
  }

  if ((event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey) {
    row.toggleSelected()
  } else if ((event as MouseEvent).shiftKey) {
    const selectedRows = table.getSelectedRowModel().rows
    if (selectedRows.length) {
      const lastSelected = selectedRows[0]
      const sortedRows = table.getSortedRowModel().rows
      const lastIndex = sortedRows.findIndex((r) => r.id == lastSelected.id)
      const currentIndex = sortedRows.findIndex((r) => r.id == row.id)
      const newSelection: RowSelectionState = {}

      const [start, end] =
        lastIndex < currentIndex ? [lastIndex, currentIndex] : [currentIndex, lastIndex]
      for (let i = start; i <= end; i++) {
        newSelection[sortedRows[i].id] = true
      }
      table.setRowSelection(newSelection)
    } else {
      table.setRowSelection({ [row.id]: true })
    }
  } else if ((event as MouseEvent).type !== 'contextmenu') {
    table.setRowSelection({ [row.id]: true })
  } else if (table.getSelectedRowModel().rows.length < 2) {
    table.setRowSelection({ [row.id]: true })
  }
}

function scrollToRow(rowId: string) {
  const el = document.querySelector(`[data-row-id="${rowId}"]`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

/**
 * Handles right mouse button click on a row. If the row is not selected, it will select the row
 * and clear the other selected rows. If the row is already selected, it will maintain the selection
 * and open context menu
 *
 * @param event   The click event
 * @param row     The row that was clicked
 * @param table   The react-table instance
 * @returns       The anchor position for the context menu
 */
export function handleRowContextMenu<T>(
  event: MouseEvent,
  row: Row<T>,
  table: Table<T>,
): PopoverPosition {
  // Stop the event from bubbling up
  event.preventDefault()
  event.stopPropagation()

  // If table has row selection disabled, do nothing
  if (table.options.enableRowSelection === false) {
    return { top: 0, left: 0 }
  }

  // Check if user right clicked on a selected row or unselected row
  // If unselected, select the row and clear all other selections
  if (row.getIsSelected() === false) {
    const newRowSelectionState: RowSelectionState = {}
    newRowSelectionState[row.id] = true
    table.setRowSelection(newRowSelectionState)
  }

  // Return the position of the context menu
  return { top: event.clientY - 4, left: event.clientX - 2 }
}
