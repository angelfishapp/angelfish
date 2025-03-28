import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TagIcon from '@mui/icons-material/LocalOffer'
import Typography from '@mui/material/Typography'
import React from 'react'

import { CategoryLabel } from '@/components/CategoryLabel'
import type { ContextMenuItem } from '@/components/ContextMenu'
import { CurrencyLabel } from '@/components/CurrencyLabel'
import { CategoryField } from '@/components/forms/CategoryField'
import { TagsField } from '@/components/forms/TagsField'
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
  const [hasSplitTransactions, setHasSplitTransactions] = React.useState(false)
  const [totalSum, setTotalSum] = React.useState(0)

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
  }, [table])

  // Render
  return (
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
      items={[
        {
          item: `Edit Transaction${selectedRows.length > 1 ? 's' : ''}`,
          onHover: () => setShowSubMenu(null),
        },
        {
          item: 'Change Category',
          icon: EditIcon,
          subMenuClassName: 'categoriesSubMenu',
          subMenuIsOpen: showSubMenu === 'categories',
          disabled: hasSplitTransactions,
          disabledText: 'Cannot Change Category as Selection Contains Split Transaction',
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
                      const rows = table.getSelectedRowModel().rows.map((row) => row.original)
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
          item: 'Add Tag',
          icon: TagIcon,
          subMenuClassName: 'tagsSubMenu',
          subMenuIsOpen: showSubMenu === 'tags',
          disabled: hasSplitTransactions,
          disabledText: 'Cannot Add Tag as Selection Contains Split Transaction',
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
                    const rows = table.getSelectedRowModel().rows.map((row) => row.original)
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
        },
        {
          item: 'Mark as Reviewed',
          icon: CheckCircleIcon,
          onHover: () => {
            setShowSubMenu(null)
          },
          onClick: () => {
            const rows = table.getSelectedRowModel().rows.map((row) => row.original)
            table.options.meta?.transactionsTable?.updateRows(rows, { is_reviewed: true })
            onClose()
          },
        },
        {
          item: 'Mark as Not Reviewed',
          icon: CheckCircleOutlineIcon,
          divider: true,
          onHover: () => {
            setShowSubMenu(null)
          },
          onClick: () => {
            const rows = table.getSelectedRowModel().rows.map((row) => row.original)
            table.options.meta?.transactionsTable?.updateRows(rows, { is_reviewed: false })
            onClose()
          },
        },
        {
          item: 'Insert New...',
          icon: AddIcon,
          divider: true,
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
          item: 'Remove',
          icon: DeleteIcon,
          className: 'menuItemRemove',
          divider: true,
          onHover: () => {
            setShowSubMenu(null)
          },
          onClick: () => {
            const rows = table.getSelectedRowModel().rows.map((row) => row.original)
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
      ]}
    />
  )
}
