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

type Dir = 'up' | 'down'
let shiftInitDir: Dir | null = null // remembers initial direction of the current Shift sequence

/**
 * Handles keyboard selection events for the table.
 *
 * 1. Down arrow will select next row, adding to selection if CMD/CNTRL also pressed
 * 2. Up arrow will select previous row, adding to selection if CMD/CNTRL also pressed
 *
 * @param event The keyboard event
 * @param table The react-table instance
 */
export function handleKeyboardSelection<T>(event: React.KeyboardEvent, table: Table<T>): void {
  if (table.options.enableRowSelection === false) return

  const key = event.key
  if (key !== 'ArrowUp' && key !== 'ArrowDown') return

  const rows = table.getRowModel().rows
  if (rows.length === 0) return

  event.preventDefault()

  const dir: Dir = key === 'ArrowDown' ? 'down' : 'up'
  const allowMulti = !!table.options.enableMultiRowSelection
  const withShift = allowMulti && event.shiftKey
  const last = rows.length - 1

  // Build contiguous selection indices from state
  const selState = table.getState().rowSelection
  const selectedIdx: number[] = []
  for (let i = 0; i < rows.length; i++) {
    if (selState[rows[i].id]) selectedIdx.push(i)
  }
  const hasSel = selectedIdx.length > 0
  const lo = hasSel ? Math.min(...selectedIdx) : -1
  const hi = hasSel ? Math.max(...selectedIdx) : -1

  const setSingle = (i: number) => {
    const idx = i < 0 ? 0 : i > last ? last : i
    table.setRowSelection({ [rows[idx].id]: true })
    scrollToRow(rows[idx].id)
  }

  const setRange = (a: number, b: number) => {
    let start = Math.min(a, b)
    let end = Math.max(a, b)
    if (start < 0) start = 0
    if (end > last) end = last
    const sel: Record<string, boolean> = {}
    for (let i = start; i <= end; i++) sel[rows[i].id] = true
    table.setRowSelection(sel)
    if (dir === 'down') {
      scrollToRow(rows[end].id)
    } else {
      scrollToRow(rows[start].id)
    }
  }

  // No Shift: single-row caret movement, reset shift sequence
  if (!withShift) {
    shiftInitDir = null
    if (!hasSel) {
      setSingle(dir === 'down' ? 0 : last)
    } else if (dir === 'down') {
      const next = hi + 1 > last ? last : hi + 1
      setSingle(next)
    } else {
      const next = lo - 1 < 0 ? 0 : lo - 1
      setSingle(next)
    }
    return
  }

  // With Shift: contiguous range logic
  if (!hasSel) {
    // Start selection at the edge we're moving toward
    setRange(dir === 'down' ? 0 : last, dir === 'down' ? 0 : last)
    shiftInitDir = dir
    return
  }

  // Initialize the sequence direction on first Shift-press
  if (shiftInitDir === null) shiftInitDir = dir

  // Determine which edge is anchored by the initial direction
  // - If started by Down -> anchor is the top (lo)
  // - If started by Up   -> anchor is the bottom (hi)
  if (dir === shiftInitDir) {
    // Extend away from the anchor
    if (dir === 'down') {
      const nextHi = hi + 1 > last ? last : hi + 1
      setRange(lo, nextHi)
    } else {
      const nextLo = lo - 1 < 0 ? 0 : lo - 1
      setRange(nextLo, hi)
    }
  } else if (shiftInitDir === 'down' && dir === 'up') {
    // Shrink toward the top anchor -> remove from bottom if possible
    if (lo < hi) {
      setRange(lo, hi - 1)
    } else {
      // Single row left: move caret upward and flip the sequence to 'up'
      const next = lo - 1 < 0 ? 0 : lo - 1
      setRange(next, next)
      shiftInitDir = 'up'
    }
  } else if (shiftInitDir === 'up' && dir === 'down') {
    // Shrink toward the bottom anchor -> remove from top if possible
    if (lo < hi) {
      setRange(lo + 1, hi)
    } else {
      // Single row left: move caret downward and flip the sequence to 'down'
      const next = hi + 1 > last ? last : hi + 1
      setRange(next, next)
      shiftInitDir = 'down'
    }
  }
}

/**
 * Helper function to scroll to a specific row in the table.
 *
 * @param rowId The ID of the row to scroll to.
 */
function scrollToRow(rowId: string) {
  const el = document.querySelector(`[data-row-id="${rowId}"]`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
