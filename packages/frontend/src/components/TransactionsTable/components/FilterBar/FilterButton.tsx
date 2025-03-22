import ButtonBase from '@mui/material/ButtonBase'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import clsx from 'clsx'
import React from 'react'

import type { FilterButtonProps } from './FilterButton.interface'
import { useStyles } from './FilterButton.styles'
import { renderFilterView } from './FilterButton.utils'

/**
 * FilterButton shown at top of TransactionsTable to filter transactions
 */

export default function FilterButton({ table, column }: FilterButtonProps) {
  const classes = useStyles()

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
      <ButtonBase
        className={clsx(classes.filterButton, filterApplied ? 'filtered' : undefined)}
        sx={{
          boxShadow: (theme) => (isPopoverOpen ? theme.shadows[2] : theme.shadows[0]),
        }}
        onClick={(e) => setFilterPopoverAnchorEl(e.target as HTMLElement)}
      >
        {column.columnDef.header as string}
      </ButtonBase>
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
          <Paper className={classes.dropDown}>{renderFilterView(table, column, onClose)}</Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
