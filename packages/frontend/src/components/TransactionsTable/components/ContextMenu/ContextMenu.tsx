import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import InventoryIcon from '@mui/icons-material/Inventory'
import TagIcon from '@mui/icons-material/LocalOffer'
import { DialogContentText } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

import { CategoryLabel } from '@/components/CategoryLabel'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { ContextMenuItem } from '@/components/ContextMenu'
import { CurrencyLabel } from '@/components/CurrencyLabel'
import { CategoryField } from '@/components/forms/CategoryField'
import { TagsField } from '@/components/forms/TagsField'
import { TextField } from '@/components/forms/TextField'
import type { TableContextMenuProps } from '@/components/Table'
import type { IAccount, ITag } from '@angelfish/core'
import { hasSplitTransaction } from '@angelfish/core'
import type { TransactionRow } from '../../data'
import { StyledContextMenu } from './ContextMenu.styles'

/**
 * Context Menu for TransactionsTable
 */
export default function TransactionTableContextMenu({
  anchorPosition,
  open,
  onClose,
  table,
}: TableContextMenuProps<TransactionRow>) {
  const selectedRows = table.getSelectedRowModel().rows

  // Component State
  const [showSubMenu, setShowSubMenu] = React.useState<'categories' | 'tags' | null>(null)
  const [hasSplitTransactions, setHasSplitTransactions] = React.useState<boolean>(false)
  const [totalSum, setTotalSum] = React.useState<number>(0)
  const [showEditNotes, setShowEditNotes] = React.useState<boolean>(false)
  const [updatedNotes, setUpdatedNotes] = React.useState<string>('')

  // Get all transactions and determine total sum of all transactions
  // and whether any of the transactions are split transactions
  React.useMemo(() => {
    const transactions = selectedRows.map((row) => row.original.transaction)
    setTotalSum(transactions.reduce((sum, transaction) => sum + transaction.amount, 0))
    setHasSplitTransactions(hasSplitTransaction(transactions))
  }, [selectedRows])

  // Generate recently used category items
  const recentCategories: ContextMenuItem[] = React.useMemo(() => {
    const categories = table.options.meta?.transactionsTable?.recentCategories ?? []
    return categories.map((category) => {
      return {
        item: <CategoryLabel account={category} className="category" iconSize={25} />,
        onClick: () => {
          const rows = table.getSelectedRowModel().rows.map((row) => row.original)
          table.options.meta?.transactionsTable?.updateRows(rows, {
            category_id: category.id,
          })
        },
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, table.options.meta?.transactionsTable?.recentCategories])

  // Generate menu items based on visible columns
  const showNote =
    table
      .getAllColumns()
      .find((col) => col.id === 'note')
      ?.getIsVisible() || false
  const showTags =
    table
      .getAllColumns()
      .find((col) => col.id === 'tags')
      ?.getIsVisible() || false
  const showIsReviewed =
    table
      .getAllColumns()
      .find((col) => col.id === 'is_reviewed')
      ?.getIsVisible() || false
  const menuItems: ContextMenuItem[] = React.useMemo(() => {
    const items: ContextMenuItem[] = [
      {
        item: `Edit Transaction${selectedRows.length > 1 ? 's' : ''}`,
        onHover: () => setShowSubMenu(null),
      },
      {
        item: 'Change Category',
        icon: InventoryIcon,
        subMenuClassName: 'categoriesSubMenu',
        subMenuIsOpen: showSubMenu === 'categories',
        disabled: hasSplitTransactions,
        disabledText: 'Cannot Change Category as Selection Contains Split Transaction',
        divider: !showTags && !showNote && !showIsReviewed,
        onHover: (isDisabled) => {
          if (isDisabled) {
            setShowSubMenu(null)
          } else {
            setShowSubMenu('categories')
          }
        },
        subMenu: [
          {
            item: (
              <CategoryField
                fullWidth
                renderAsValue={false}
                margin="none"
                accountsWithRelations={
                  table.options.meta?.transactionsTable?.accountsWithRelations ?? []
                }
                onChange={(category) => {
                  if (category) {
                    const rows = selectedRows.map((row) => row.original)
                    table.options.meta?.transactionsTable?.updateRows(rows, {
                      category_id: (category as IAccount).id,
                    })
                    setShowSubMenu(null)
                    onClose()
                  }
                }}
                onCreate={(name) => table.options.meta?.transactionsTable?.onCreateCategory(name)}
              />
            ),
            className: 'search-categories',
          },
          {
            item: 'Recently Used',
          },
          ...recentCategories,
        ],
      },
      {
        item: 'Insert New...',
        icon: AddIcon,
        onHover: () => {
          setShowSubMenu(null)
        },
        onClick: () => {
          // Get most recent date from selected rows
          const date = selectedRows.reduce(
            (date, row) => {
              if (row.original.transaction.date > date) {
                return row.original.transaction.date
              }
              return date
            },
            new Date(1900, 0, 1),
          )
          // Create new row with date
          table.options.meta?.transactionsTable?.insertNewRow(date)
          onClose()
        },
      },
      {
        item: 'Duplicate',
        icon: ContentCopyIcon,
        divider: true,
        onHover: () => {
          setShowSubMenu(null)
        },
        onClick: () => {
          table.options.meta?.transactionsTable?.duplicateRows(
            selectedRows.map((row) => row.original),
          )
        },
      },
      {
        item: 'Remove',
        icon: DeleteIcon,
        className: 'menuItemRemove',
        divider: true,
        onHover: () => {
          setShowSubMenu(null)
        },
        onClick: () => {
          const rows = selectedRows.map((row) => row.original)
          table.options.meta?.transactionsTable?.deleteRows(rows)
          onClose()
        },
      },
      {
        onHover: () => {
          setShowSubMenu(null)
        },
        item: (
          <Typography variant="body2" component="span" className="menuSummary">
            {`${selectedRows.length} transaction${selectedRows.length == 1 ? '' : 's'} : `}
            <CurrencyLabel
              value={totalSum}
              currency={table.options.meta?.transactionsTable?.account?.acc_iso_currency}
              fontSize={14}
            />
          </Typography>
        ),
      },
    ]

    if (showTags) {
      items.splice(2, 0, {
        item: 'Add Tag',
        icon: TagIcon,
        subMenuClassName: 'tagsSubMenu',
        subMenuIsOpen: showSubMenu === 'tags',
        disabled: hasSplitTransactions,
        disabledText: 'Cannot Add Tag as Selection Contains Split Transaction',
        divider: showIsReviewed ? false : showNote ? false : true,
        onHover: (isDisabled) => {
          if (isDisabled) {
            setShowSubMenu(null)
          } else {
            setShowSubMenu('tags')
          }
        },
        subMenu: [
          {
            item: (
              <TagsField
                fullWidth
                margin="none"
                tags={table.options.meta?.transactionsTable?.allTags ?? []}
                onChange={(tags) => {
                  const rows = selectedRows.map((row) => row.original)
                  table.options.meta?.transactionsTable?.updateRows(rows, {
                    add_tags: tags as ITag[],
                  })
                  setShowSubMenu(null)
                  onClose()
                }}
              />
            ),
            className: 'tags',
          },
        ],
      })
    }

    if (showNote) {
      items.splice(showTags ? 3 : 2, 0, {
        item: 'Edit Notes...',
        icon: EditNoteIcon,
        disabled: hasSplitTransactions,
        divider: showIsReviewed ? false : true,
        onHover: () => {
          setShowSubMenu(null)
        },
        onClick: () => {
          if (selectedRows.length === 1) {
            // Prepopulate notes if only one row is selected
            setUpdatedNotes(selectedRows[0].original.transaction.line_items[0]?.note ?? '')
          }
          setShowEditNotes(true)
        },
      })
    }

    if (showIsReviewed) {
      items.splice(showTags ? (showNote ? 4 : 3) : showNote ? 3 : 2, 0, {
        item: 'Mark as Reviewed',
        icon: CheckCircleIcon,
        divider: true,
        onHover: () => {
          setShowSubMenu(null)
        },
        onClick: () => {
          const rows = selectedRows.map((row) => row.original)
          table.options.meta?.transactionsTable?.updateRows(rows, { is_reviewed: true })
          onClose()
        },
      })
    }
    return items
  }, [
    showNote,
    showTags,
    showIsReviewed,
    table,
    selectedRows,
    totalSum,
    hasSplitTransactions,
    showSubMenu,
    onClose,
    recentCategories,
  ])

  // Render
  return (
    <React.Fragment>
      <StyledContextMenu
        anchorPosition={anchorPosition}
        windowMarginX={300}
        windowMarginY={1}
        open={open}
        unMountOnExit={true}
        onClose={() => {
          setShowSubMenu(null)
          onClose()
        }}
        items={menuItems}
      />
      <ConfirmDialog
        title="Edit Transaction Notes"
        open={showEditNotes}
        onClose={() => setShowEditNotes(false)}
        onConfirm={() => {
          const rows = selectedRows.map((row) => row.original)
          table.options.meta?.transactionsTable?.updateRows(rows, {
            note: updatedNotes.trim() === '' ? null : updatedNotes.trim(),
          })
          setUpdatedNotes('')
          setShowEditNotes(false)
        }}
      >
        <DialogContentText sx={{ width: 500, marginTop: 1 }} component="div">
          <TextField
            fullWidth
            helperText="Leave blank to clear notes"
            margin="none"
            onChange={(e) => setUpdatedNotes(e.target.value)}
            value={updatedNotes}
          />
        </DialogContentText>
      </ConfirmDialog>
    </React.Fragment>
  )
}
