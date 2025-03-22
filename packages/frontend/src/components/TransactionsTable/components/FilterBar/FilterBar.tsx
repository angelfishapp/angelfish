import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import SettingsIcon from '@mui/icons-material/Settings'
import UploadIcon from '@mui/icons-material/Upload'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import clsx from 'clsx'
import React from 'react'

import type { DropdownMenuItem } from '@/components/DropdownMenuButton'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { Search } from '@/components/Search'
import type { TableFilterBarProps } from '@/components/Table'
import type { TransactionRow } from '../../data'
import { useStyles } from './FilterBar.styles'
import FilterButton from './FilterButton'

/**
 * FilterBar shown at top of TransactionsTable to filter transactions
 */

export default function FilterBar({ table }: TableFilterBarProps<TransactionRow>) {
  const classes = useStyles()

  // Component State
  const [filtersVisible, setFiltersVisible] = React.useState<boolean>(false)

  return (
    <Box display="flex" width="100%" alignItems="center" marginBottom={2}>
      {/* Show/Hide Filter Bar Button */}
      <IconButton
        className={clsx(classes.showFilterButton, filtersVisible && classes.showFilterButtonActive)}
        onClick={() => {
          setFiltersVisible(!filtersVisible)
          table.resetColumnFilters()
        }}
        size="large"
      >
        {filtersVisible ? <FilterListOffIcon /> : <FilterListIcon />}
      </IconButton>
      {filtersVisible ? (
        /* Render Filter Bar */
        <Box className={classes.filterBar} marginLeft={1}>
          {/* Render Filter Buttons */}
          <>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  /* Render the columns filter UI */
                  header.column.getCanFilter() ? (
                    <FilterButton key={header.id} table={table} column={header.column} />
                  ) : null,
                )}
              </React.Fragment>
            ))}
          </>

          <div className={classes.divVertical}></div>

          <Search
            autoFocus
            onChange={(search) => {
              table.setGlobalFilter(search)
            }}
            placeholder="Search Transactions..."
            hasShadow={false}
            value={table.getState().globalFilter || ''}
          />
        </Box>
      ) : (
        <Box flexGrow={1} display="flex">
          <Box flexGrow={1} marginLeft={1}>
            <Search
              autoFocus
              onChange={(search) => {
                table.setGlobalFilter(search)
              }}
              placeholder="Search Transactions..."
              value={table.getState().globalFilter || ''}
            />
          </Box>
          <Box marginLeft={1}>
            <IconButton
              color="primary"
              onClick={() => table.options.meta?.transactionsTable?.insertNewRow()}
              size="large"
              title="Add Transaction"
              className={classes.actionButton}
              sx={{ marginRight: 1 }}
            >
              <AddIcon />
            </IconButton>
            {table.options.meta?.transactionsTable?.onImportTransactions && (
              <IconButton
                color="primary"
                onClick={() => table.options.meta?.transactionsTable?.onImportTransactions?.()}
                size="large"
                title="Import Transactions"
                className={classes.actionButton}
              >
                <UploadIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      )}
      <Box marginLeft={1}>
        <DropdownMenuButton
          Icon={SettingsIcon}
          label="Table Settings"
          size="large"
          className={clsx(classes.actionButton, 'settingsButton')}
          menuItems={(
            [
              {
                label: 'Show Columns',
              },
            ] as DropdownMenuItem[]
          ).concat(
            table
              .getAllColumns()
              .filter(
                // if header is not defined it retuns a function and in that case we dont want to show those column who dont have haeder value
                (column) =>
                  !!column.columnDef.header &&
                  typeof column.columnDef.header === 'string' &&
                  column.getCanHide(),
              )
              .map((column) => ({
                label: column.columnDef.header as string,
                onClick: () => column.toggleVisibility(),
                icon: column.getIsVisible() ? CheckBoxIcon : CheckBoxOutlineBlankIcon,
              })),
          )}
        />
      </Box>
    </Box>
  )
}
