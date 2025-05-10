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
export function handleRowSelection<T>(event: MouseEvent, row: Row<T>, table: Table<T>): void {
  // If table has row selection disabled, do nothing
  if (table.options.enableRowSelection === false) {
    return
  }

  // If multi-select is disabled, only allow one row to be selected
  if (table.options.enableMultiRowSelection === false) {
    const newRowSelectionState: RowSelectionState = {}
    newRowSelectionState[row.id] = true
    table.setRowSelection(newRowSelectionState)
    return
  }

  // Handle multi-select events
  if (event.ctrlKey || event.metaKey) {
    // 1. Click + CMD/CTRL - select multiple rows
    row.toggleSelected()
  } else if (event.shiftKey) {
    // 2. Click + SHIFT - Range Select multiple rows
    if (table.getSelectedRowModel().rows.length) {
      const lastSelectedRow = table.getSelectedRowModel().rows[0]
      const sortedRows = table.getSortedRowModel().rows
      const lastIndex = sortedRows.findIndex((r) => r.id == lastSelectedRow.id)
      const currentIndex = sortedRows.findIndex((r) => r.id == row.id)
      const newRowSelectionState: RowSelectionState = {}
      if (lastIndex < currentIndex) {
        for (let i = lastIndex; i <= currentIndex; i++) {
          const selectedRow = sortedRows[i]
          newRowSelectionState[selectedRow.id] = true
        }
      } else {
        for (let i = currentIndex; i <= lastIndex; i++) {
          const selectedRow = sortedRows[i]
          newRowSelectionState[selectedRow.id] = true
        }
      }
      table.setRowSelection(newRowSelectionState)
    } else {
      // No rows previously selected, select only current row
      const newRowSelectionState: RowSelectionState = {}
      newRowSelectionState[row.id] = true
      table.setRowSelection(newRowSelectionState)
    }
  } else if (event.type !== 'contextmenu') {
    const newRowSelectionState: RowSelectionState = {}
    newRowSelectionState[row.id] = true
    table.setRowSelection(newRowSelectionState)
  } else if (table.getSelectedRowModel().rows.length < 2) {
    const newRowSelectionState: RowSelectionState = {}
    newRowSelectionState[row.id] = true
    table.setRowSelection(newRowSelectionState)
  }
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
