/* eslint-disable react/jsx-no-useless-fragment */
/**
 * Helper Function to define table columns
 */

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import CheckBox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import type { ColumnDef, RowData, Table } from '@tanstack/react-table'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { CategoryLabel } from '@/components/CategoryLabel'
import { CurrencyLabel } from '@/components/CurrencyLabel'
import { AmountField } from '@/components/forms/AmountField'
import { CategoryField } from '@/components/forms/CategoryField'
import { DateField } from '@/components/forms/DateField'
import { TagsField } from '@/components/forms/TagsField'
import { TextField } from '@/components/forms/TextField'
import type { IAccount, ITag, IUser } from '@angelfish/core'
import { AmountFilter, CategoryFilter, DateFilter, PayeeFilter, TagsFilter } from './filters'
import { AccountSort, DateSort, TagsSort } from './sorting'
import type { FormData, TransactionRow } from './types'

/*
 * Extend react-table ColumnDef to add EditCell function for
 * edit mode on each column
 */
declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    transactionsTable?: {
      editCell: (
        name: FieldPath<FormData>,
        formControl: Control<FormData, any>,
        table: Table<TransactionRow>,
      ) => ReactNode | null
    }
  }
}

/**
 * Type to scope columns that are supported on Table
 */

export type SupportedColumnNames =
  | 'date'
  | 'title'
  | 'notes'
  | 'category'
  | 'owners'
  | 'currency'
  | 'amount'
  | 'balance'
  | 'tags'
  | 'account'
  | 'is_reviewed'

/**
 * Build list of Columns for Table using SupportedColumnNames only. By default will only display
 * all columns unless overriden
 *
 *
 * list of tags in system for dropdown
 * @param {Tag[]} tags
 *
 * An Array of SupportedColumnNames
 * @param {SupportedColumnNames[]}
 *
 * Callback to delete a Transaction
 * @param {(id: number) => void} onDeleteTransaction
 *
 * column definition of Transaction Rows
 * @returns {ColumnDef<TransactionRow>[]}
 */
export function buildColumns(
  colnames: SupportedColumnNames[] = [
    'date',
    'title',
    'category',
    'tags',
    'notes',
    'amount',
    'balance',
    'is_reviewed',
  ],
): ColumnDef<TransactionRow>[] {
  const columns: ColumnDef<TransactionRow>[] = []

  // Sort colnames to ensure regular order regardless of array order so we always get the columns
  // in same order
  const columns_order = [
    'date',
    'title',
    'owners',
    'account',
    'category',
    'tags',
    'notes',
    'currency',
    'amount',
    'balance',
    'is_reviewed',
  ]
  colnames.sort((a, b) => {
    const indexA = columns_order.indexOf(a)
    const indexB = columns_order.indexOf(b)

    // If a is not in order, return 1 to move it to the end
    if (indexA === -1) return 1

    // If b is not in order, return -1 to move it to the end
    if (indexB === -1) return -1

    // Otherwise, compare their indices in the order array
    return indexA - indexB
  })

  colnames.forEach((colname) => {
    switch (colname) {
      case 'date':
        columns.push({
          id: 'date',
          header: 'Date',
          accessorKey: 'date',
          footer: 'Date Footer',
          minSize: 80,
          size: 80,
          enableHiding: false,
          enableColumnFilter: true,
          enableGlobalFilter: false,
          filterFn: DateFilter,
          sortingFn: DateSort,
          cell: ({ row }) => {
            if (row.depth >= 1) return null
            return row.original.date?.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC',
            })
          },
          aggregatedCell: ({ row }) => {
            return row.original.date?.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC',
            })
          },
          meta: {
            transactionsTable: {
              editCell: (name, formControl) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    rules={{ required: true }}
                    render={({ field: { onChange, value, ...restField }, formState }) => (
                      <DateField
                        margin="none"
                        required
                        fullWidth
                        disableFuture
                        className="edit-date-field"
                        error={formState.errors?.date ? true : false}
                        helperText={formState.errors?.date ? 'Date is required' : <></>}
                        onChange={(date) => {
                          onChange(date)
                        }}
                        {...restField}
                        value={value as Date}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'notes':
        columns.push({
          id: 'notes',
          header: 'Notes',
          accessorKey: 'note',
          size: 235,
          enableColumnFilter: false,
          enableGlobalFilter: true,
          cell: ({ row }) => {
            if (row.original.isSplit && row.depth === 0) return null
            return <Box width="100%">{row.original.note ?? <>&nbsp;</>}</Box>
          },
          meta: {
            transactionsTable: {
              editCell: (name, formControl) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    render={({ field }) => (
                      <TextField
                        margin="none"
                        fullWidth
                        placeholder="Add a note..."
                        className="edit-note-field"
                        {...field}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'title':
        columns.push({
          id: 'title',
          header: 'Payee',
          accessorKey: 'title',
          footer: undefined,
          minSize: 200,
          maxSize: 500,
          enableHiding: false,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: PayeeFilter,
          cell: ({ row }) => {
            if (row.depth >= 1) return null
            return <>{row.original.title}</>
          },
          meta: {
            transactionsTable: {
              editCell: (name, formControl) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    rules={{ required: true }}
                    render={({ field, formState }) => (
                      <TextField
                        margin="none"
                        placeholder="E.g. Walmart"
                        fullWidth
                        required
                        className="edit-title-field"
                        error={!!formState.errors?.title}
                        helperText={formState.errors?.title ? 'Payee is required' : <></>}
                        {...field}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'category':
        columns.push({
          id: 'category',
          header: 'Category',
          accessorKey: 'category',
          minSize: 200,
          maxSize: 500,
          enableHiding: false,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: CategoryFilter,
          sortingFn: AccountSort,
          sortUndefined: -1,
          cell: ({ row }) => {
            return (
              <CategoryLabel account={row.original.category} className="category" iconSize={25} />
            )
          },
          aggregatedCell: ({ row }) => {
            // Create a 'Split' category to render
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => row.toggleExpanded()}
              >
                <span className="category">
                  <em>Split</em>
                </span>
                {row.getIsExpanded() ? (
                  <ExpandMoreIcon className="expand-arrow" />
                ) : (
                  <ChevronRightIcon className="expand-arrow" />
                )}
              </div>
            )
          },
          meta: {
            transactionsTable: {
              editCell: (name, formControl, table) => {
                const accounts = table.options.meta?.transactionsTable?.accountsWithRelations ?? []
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    render={({ field: { value, onChange, ...restField } }) => (
                      <CategoryField
                        margin="none"
                        accountsWithRelations={accounts}
                        onCreate={
                          table.options.meta?.transactionsTable?.onCreateCategory ?? undefined
                        }
                        fullWidth
                        {...restField}
                        value={accounts.filter((account) => account.id === value)[0] ?? null}
                        onChange={(account) => {
                          if (account) {
                            onChange((account as IAccount).id)
                          } else {
                            onChange(null)
                          }
                        }}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'tags':
        columns.push({
          id: 'tags',
          header: 'Tags',
          accessorKey: 'tags',
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: TagsFilter,
          sortingFn: TagsSort,
          cell: ({ row }) => {
            if (row.original.isSplit && row.depth === 0) return null

            return (
              <>
                {row.original.tags?.map((tag) => (
                  <Chip key={tag.id} label={tag.name} sx={{ mx: 1 }} />
                ))}
              </>
            )
          },
          meta: {
            transactionsTable: {
              editCell: (name, formControl, table) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    render={({ field }) => (
                      <TagsField
                        margin="none"
                        tags={table.options.meta?.transactionsTable?.allTags ?? []}
                        fullWidth
                        {...field}
                        onChange={(tags) => field.onChange(tags as ITag[])}
                        value={field.value as ITag[]}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'owners':
        columns.push({
          id: 'owners',
          header: 'Owner(s)',
          accessorKey: 'owners',
          enableColumnFilter: false,
          enableGlobalFilter: false,
          cell: ({ row }) => {
            if (row.depth >= 1) return null
            return row.original.owners?.map((owner, index) => (
              <span key={owner.id}>
                {owner.first_name} {owner.last_name}
                {index < (row.original.owners as IUser[]).length - 1 ? ', ' : ''}
              </span>
            ))
          },
          aggregatedCell: ({ row }) => {
            return (
              <span>
                {row.original.owners?.at(0)?.first_name} {row.original.owners?.at(0)?.last_name}
              </span>
            )
          },
          meta: {
            transactionsTable: {
              editCell: () => {
                // Cannot edit user, edit account owner to change
                return null
              },
            },
          },
        })
        break
      case 'currency':
        columns.push({
          id: 'currency',
          header: 'Currency',
          accessorKey: 'currency',
          enableColumnFilter: false,
          cell: ({ row }) => row.original.currency?.toUpperCase() ?? null,
          aggregatedCell: ({ row }) => row.original.currency?.toUpperCase() ?? null,
          meta: {
            transactionsTable: {
              editCell: () => {
                // Cannot change currency, edit account to change
                return null
              },
            },
          },
        })
        break
      case 'account':
        columns.push({
          id: 'account',
          header: 'Account',
          accessorKey: 'account',
          enableColumnFilter: false,
          sortingFn: AccountSort,
          cell: ({ row }) => {
            if (row.depth >= 1) return null
            return (
              <CategoryLabel account={row.original.account} className="account" iconSize={25} />
            )
          },
          aggregatedCell: ({ row }) => (
            <CategoryLabel account={row.original.account} className="account" iconSize={25} />
          ),
          meta: {
            transactionsTable: {
              editCell: () => {
                // Cannot edit the account
                return null
              },
            },
          },
        })
        break
      case 'amount':
        columns.push({
          id: 'amount',
          header: 'Amount',
          accessorKey: 'amount',
          minSize: 100,
          size: 100,
          enableHiding: false,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: AmountFilter,
          cell: ({ row }) => (
            <CurrencyLabel
              value={row.original.amount ?? 0}
              currency={row.original.currency}
              className={clsx(
                'currency',
                (row.original.amount ?? 0) < 0 ? 'amount-debit' : 'amount-credit',
              )}
              showPositive={(row.original.amount ?? 0) > 0}
            />
          ),
          aggregatedCell: ({ row }) => (
            <CurrencyLabel
              value={row.original.amount ?? 0}
              currency={row.original.currency}
              className={clsx(
                'currency',
                (row.original.amount ?? 0) < 0 ? 'amount-debit' : 'amount-credit',
              )}
              showPositive={(row.original.amount ?? 0) > 0}
            />
          ),
          meta: {
            transactionsTable: {
              editCell: (name, formControl) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    rules={{ required: true }}
                    render={({ field: { onChange, value, ...restField }, formState }) => (
                      <AmountField
                        fullWidth
                        value={value as any}
                        allowNegative={true}
                        required
                        margin="none"
                        error={formState.errors?.amount ? true : false}
                        helperText={formState.errors?.amount ? 'Amount is required' : undefined}
                        onChange={(value) => onChange(value)}
                        {...restField}
                      />
                    )}
                  />
                )
              },
            },
          },
        })
        break
      case 'balance':
        columns.push({
          id: 'balance',
          header: 'Balance',
          accessorKey: 'balance',
          minSize: 100,
          size: 100,
          enableHiding: false,
          enableColumnFilter: false,
          enableGlobalFilter: false,
          enableSorting: false,
          cell: ({ row }) => {
            if (row.depth >= 1) return null
            return (
              <CurrencyLabel
                value={row.original.balance ?? 0}
                currency={row.original.currency}
                className={clsx(
                  'currency',
                  (row.original.balance ?? 0) < 0 ? 'balance-negative' : 'balance-positive',
                )}
              />
            )
          },
          aggregatedCell: ({ row }) => (
            <CurrencyLabel
              value={row.original.balance ?? 0}
              currency={row.original.currency}
              className={clsx(
                'currency',
                (row.original.balance ?? 0) < 0 ? 'balance-negative' : 'balance-positive',
              )}
            />
          ),
          meta: {
            transactionsTable: {
              editCell: () => {
                // Calculated field, cannot edit
                return null
              },
            },
          },
        })
        break
      case 'is_reviewed':
        columns.push({
          id: 'is_reviewed',
          header: 'Reviewed?',
          accessorKey: 'isReviewed',
          minSize: 70,
          size: 70,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          cell: ({ row, table }) => {
            if (row.depth >= 1) return null
            return (
              <div className="is_reviewed">
                <CheckBox
                  color={row.original.isReviewed ? 'success' : undefined}
                  icon={<CheckCircleOutlineIcon />}
                  checked={row.original.isReviewed}
                  checkedIcon={<CheckCircleIcon />}
                  onChange={(e) => {
                    table?.options.meta?.transactionsTable?.updateRows([row.original], {
                      is_reviewed: e.target.checked,
                    })
                  }}
                />
              </div>
            )
          },
          aggregatedCell: ({ row, table }) => (
            <div className="is_reviewed">
              <CheckBox
                color={row.original.isReviewed ? 'success' : undefined}
                icon={<CheckCircleOutlineIcon />}
                checked={row.original.isReviewed}
                checkedIcon={<CheckCircleIcon />}
                onChange={(e) => {
                  table?.options.meta?.transactionsTable?.updateRows([row.original], {
                    is_reviewed: e.target.checked,
                  })
                }}
              />
            </div>
          ),
          meta: {
            transactionsTable: {
              editCell: (name, formControl) => {
                return (
                  <Controller
                    name={name}
                    control={formControl}
                    rules={{ required: false }}
                    render={({ field: { onChange, value, ...restField } }) => (
                      <div className="is_reviewed">
                        <CheckBox
                          color={value ? 'success' : undefined}
                          icon={<CheckCircleOutlineIcon />}
                          checked={value as boolean}
                          checkedIcon={<CheckCircleIcon />}
                          onChange={(e) => {
                            onChange(e.target.checked)
                          }}
                          {...restField}
                        />
                      </div>
                    )}
                  />
                )
              },
            },
          },
        })
        break
      default:
        throw Error('Unsupported Column Name: ' + colname)
    }
  })

  return columns
}
