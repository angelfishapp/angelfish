import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import React from 'react'

import type { FilterButtonProps } from './FilterButton.interface'
import { StyledFilterButton } from './FilterButton.styles'
import { renderFilterView } from './FilterButton.utils'

/**
 * FilterButton shown at top of TransactionsTable to filter transactions
 */

export default function FilterButton({ table, column }: FilterButtonProps) {
  // Component State
  const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] = React.useState<HTMLElement | null>(null)
  const isPopoverOpen = Boolean(filterPopoverAnchorEl)
  const [filterApplied, setFilterApplied] = React.useState<boolean>(false)

  const filterValue = column.getFilterValue()

  // Callback to Close Popover
  const onClose = () => {
    setFilterPopoverAnchorEl(null)
  }

  // Check if the Filter is currently applied
  React.useEffect(() => {
    if (filterValue) {
      if (Array.isArray(filterValue)) {
        if ((filterValue as []).length > 0) {
          setFilterApplied(true)
        } else {
          setFilterApplied(false)
        }
      } else {
        setFilterApplied(true)
      }
    } else {
      setFilterApplied(false)
    }
  }, [filterValue])

  return (
    <>
      <StyledFilterButton
        filtered={filterApplied}
        sx={{
          boxShadow: (theme) => (isPopoverOpen ? theme.shadows[2] : theme.shadows[0]),
        }}
        onClick={(e) => setFilterPopoverAnchorEl(e.target as HTMLElement)}
      >
        {column.columnDef.header as string}
      </StyledFilterButton>
      <Popper
        open={isPopoverOpen}
        anchorEl={filterPopoverAnchorEl}
        placement="bottom-start"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ]}
      >
        <ClickAwayListener
          onClickAway={() => {
            onClose()
          }}
        >
          <Paper
            sx={{
              minWidth: 250,
              padding: 0,
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
          >
            {renderFilterView(table, column, onClose)}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
