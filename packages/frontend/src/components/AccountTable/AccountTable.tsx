import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import type { PopoverPosition } from '@mui/material/Popover'
import type { GroupingState, SortingState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'

import { ContextMenu } from '@/components/ContextMenu'
import type { IAccount, IInstitution } from '@angelfish/core'
import type { AccountTableRow } from './AccountTable.data'
import { AccountTableColumns, buildTableRows } from './AccountTable.data'
import type { AccountTableProps } from './AccountTable.interface'
import AccountTableRowComponent from './components/AccountTableRow'

/**
 * Account Table. Lists Institutions and their associated Accounts.
 */
export default function AccountTable({
  accountsWithRelations,
  book_default_currency,
  disableContextMenu = false,
  institutions,
  groupBy = 'acc_institution',
  selectedAccountId,
  showClosedAccounts = false,
  sortBy = 'name',
  onSelectAccount,
  onCreateAccount,
  onEditAccount,
  onDeleteAccount,
  onSelectInstitution,
  onCreateInstitution,
  onEditInstitution,
  onDeleteInstitution,
}: AccountTableProps) {
  // Component State
  const [selectedInstitution, setSelectedInstitution] = React.useState<IInstitution | undefined>(
    undefined,
  )
  const [selectedAccount, setSelectedAccount] = React.useState<Partial<IAccount> | undefined>(
    undefined,
  )
  const [contextMenuPos, setContextMenuPos] = React.useState<PopoverPosition | null>(null)
  const [contextMenuRowType, setContextMenuRowType] = React.useState<'Account' | 'Institution'>(
    'Account',
  )

  // React-Table Data
  const tableRows: AccountTableRow[] = React.useMemo(() => {
    return buildTableRows(accountsWithRelations, institutions, showClosedAccounts)
  }, [accountsWithRelations, institutions, showClosedAccounts])

  // React-Table State
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [grouping, setGrouping] = React.useState<GroupingState>([])

  // Update groupBy and sortBy when they change
  React.useEffect(() => {
    if (groupBy === 'acc_institution') {
      setGrouping(['acc_institution_id'])
    } else if (groupBy === 'acc_country') {
      setGrouping(['acc_country', 'acc_institution_id'])
    } else {
      setGrouping([groupBy])
    }
    setSorting([
      // Use local_current_balance for sorting if sortBy is current_balance
      { id: sortBy === 'current_balance' ? 'local_current_balance' : sortBy, desc: true },
    ])
  }, [groupBy, sortBy])

  // Configure react-table
  const table = useReactTable<AccountTableRow>({
    columns: AccountTableColumns,
    data: tableRows,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    enableSorting: true,
    enableGrouping: true,
    state: {
      sorting,
      grouping,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
  })

  // Render
  return (
    <React.Fragment>
      <List
        sx={{ width: '100%', paddingTop: 0, paddingBottom: 0 }}
        onContextMenu={(e) => {
          if (disableContextMenu) return
          e.preventDefault()
          const targetElement = e.target as HTMLElement
          // Find the closest parent <tr> with the data-row attribute
          const parentRow =
            targetElement.closest('li[data-row]') || targetElement.closest('div[data-row]')
          if (parentRow) {
            const rowId = parentRow.getAttribute('data-row')
            if (rowId) {
              const rowType = rowId.includes('institution') ? 'Institution' : 'Account'
              const rowIdParts = rowId.split('-')
              const rowIdValue = parseInt(rowIdParts[rowIdParts.length - 1])
              if (rowType === 'Institution') {
                const selectedInstitution = institutions.find((inst) => inst.id === rowIdValue)
                setSelectedInstitution(selectedInstitution)
                onSelectInstitution(selectedInstitution)
              } else {
                const selectedAccount = accountsWithRelations.find((acc) => acc.id === rowIdValue)
                setSelectedAccount(selectedAccount)
                onSelectAccount(selectedAccount)
              }
              setContextMenuRowType(rowType)
              setContextMenuPos({
                top: e.clientY,
                left: e.clientX,
              })
            } else {
              setContextMenuPos(null)
            }
          }
        }}
      >
        {table.getRowModel().flatRows.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No Institutions Found"
              secondary={
                <a
                  onClick={() => onCreateInstitution()}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Add An Institution
                </a>
              }
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        ) : (
          <React.Fragment>
            {table.getRowModel().flatRows.map((row) => {
              return (
                <AccountTableRowComponent
                  key={row.id}
                  row={row}
                  book_default_currency={book_default_currency}
                  groupBy={groupBy}
                  selectedAccountId={selectedAccountId}
                  onCreateAccount={(institution) => {
                    setSelectedInstitution(institution)
                    onCreateAccount(institution)
                  }}
                  onEditAccount={(aid) => {
                    const selectedAccount = accountsWithRelations.find((acc) => acc.id === aid)
                    setSelectedAccount(selectedAccount)
                    onEditAccount(selectedAccount as IAccount)
                  }}
                  onEditInstitution={onEditInstitution}
                  onSelectAccount={(id) => {
                    onSelectAccount(accountsWithRelations.find((acc) => acc.id === id) as IAccount)
                  }}
                />
              )
            })}
          </React.Fragment>
        )}
      </List>
      <ContextMenu
        open={contextMenuPos !== null}
        anchorPosition={contextMenuPos ?? { top: 0, left: 0 }}
        onClose={() => setContextMenuPos(null)}
        items={
          contextMenuRowType === 'Institution'
            ? [
                {
                  item: selectedInstitution?.name || '',
                },
                {
                  item: `Edit`,
                  icon: EditIcon,
                  onClick: () => onEditInstitution(selectedInstitution as IInstitution),
                },
                {
                  item: `Add Account`,
                  icon: AddCircleIcon,
                  divider: true,
                  onClick: () => onCreateAccount(selectedInstitution as IInstitution),
                },
                {
                  item: `Remove`,
                  icon: DeleteIcon,
                  color: 'error',
                  onClick: () => onDeleteInstitution(selectedInstitution as IInstitution),
                },
              ]
            : [
                {
                  item: selectedAccount?.name || '',
                },
                {
                  item: `Edit`,
                  icon: EditIcon,
                  onClick: () => onEditAccount(selectedAccount as IAccount),
                  divider: true,
                },
                {
                  item: `Delete`,
                  icon: DeleteIcon,
                  color: 'error',
                  onClick: () => onDeleteAccount(selectedAccount as IAccount),
                },
              ]
        }
      />
    </React.Fragment>
  )
}
