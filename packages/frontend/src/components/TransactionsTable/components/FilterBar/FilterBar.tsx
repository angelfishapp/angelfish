import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import SettingsIcon from '@mui/icons-material/Settings'
import UploadIcon from '@mui/icons-material/Upload'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import React from 'react'

import type { DropdownMenuItem } from '@/components/DropdownMenuButton'
import { Search } from '@/components/Search'
import type { TableFilterBarProps } from '@/components/Table'
import type { TransactionRow } from '../../data'
import { StyledActionButton, StyledFilterBar, StyledSettingsButton } from './FilterBar.styles'
import FilterButton from './FilterButton'

/**
 * FilterBar shown at top of TransactionsTable to filter transactions
 */
export default function FilterBar({ table }: TableFilterBarProps<TransactionRow>) {
  // Component State
  const [filtersVisible, setFiltersVisible] = React.useState<boolean>(false)

  // Get expand all splits state from table meta
  const expandAllSplits = table.options.meta?.transactionsTable?.expandAllSplits ?? false
  const toggleExpandAllSplits = table.options.meta?.transactionsTable?.toggleExpandAllSplits

  return (
    <Box display="flex" width="100%" alignItems="center" marginBottom={2}>
      {/* Show/Hide Filter Bar Button */}
      <IconButton
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 48,
          height: 48,
          boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
          backgroundColor: filtersVisible ? theme.palette.primary.main : theme.palette.common.white,
          color: filtersVisible ? theme.palette.common.white : theme.palette.text.primary,
          '&:hover': {
            backgroundColor: filtersVisible
              ? theme.palette.primary.main
              : theme.palette.common.white,
          },
        })}
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
        <StyledFilterBar marginLeft={1}>
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

          <div className="divVertical"></div>

          <Search
            autoFocus
            onChange={(search) => {
              table.setGlobalFilter(search)
            }}
            placeholder="Search Transactions..."
            hasShadow={false}
            value={table.getState().globalFilter || ''}
          />
        </StyledFilterBar>
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
            <StyledActionButton
              color="primary"
              onClick={() => table.options.meta?.transactionsTable?.insertNewRow()}
              size="large"
              title="Add Transaction"
              sx={{ marginRight: 1 }}
            >
              <AddIcon />
            </StyledActionButton>

            {table.options.meta?.transactionsTable?.onImportTransactions && (
              <StyledActionButton
                color="primary"
                onClick={() => table.options.meta?.transactionsTable?.onImportTransactions?.()}
                size="large"
                title="Import Transactions"
              >
                <UploadIcon />
              </StyledActionButton>
            )}
          </Box>
        </Box>
      )}

      <Box marginLeft={1}>
        <StyledSettingsButton
          Icon={SettingsIcon}
          label="Table Settings"
          size="large"
          menuItems={(
            [
              {
                label: 'Show Columns',
              },
            ] as DropdownMenuItem[]
          )
            .concat(
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
            )
            .concat([
              // Add separator using existing pattern
              {
                label: '─────────────────────',
                disabled: true,
              },
              // Add Expand All Splits option
              {
                label: 'Expand All Splits',
                onClick: () => {
                  if (toggleExpandAllSplits) {
                    toggleExpandAllSplits(!expandAllSplits)
                  }
                },
                icon: expandAllSplits ? CheckBoxIcon : CheckBoxOutlineBlankIcon,
              },
            ] as DropdownMenuItem[])}
        />
      </Box>
    </Box>
  )
}
