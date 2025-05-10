import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'
import type { FieldPath } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'

import { CloseButton } from '@/components/CloseButton'
import { CurrencyLabel } from '@/components/CurrencyLabel'
import type { DefaultTableRowProps } from '@/components/Table'
import { getTransactionFormData } from '../../data/'
import type { FormData, TransactionRow } from '../../data/types'

/**
 * Edit view of TableRow for TransactionTable
 */
export default React.forwardRef<HTMLTableRowElement, DefaultTableRowProps<TransactionRow>>(
  function TableRowEdit({ className, row, table }: DefaultTableRowProps<TransactionRow>, ref) {
    // Generate react-hook-form default values for the form
    const defaultValues: FormData = React.useMemo(() => {
      return getTransactionFormData(row.original)
    }, [row.original])

    // Setup react-hook-form
    const {
      control,
      handleSubmit,
      watch,
      setValue,
      getValues,
      formState: { isValid, isDirty },
    } = useForm<FormData>({ defaultValues, mode: 'onBlur' })
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'lineItems',
      rules: {
        validate: (lineItems) => {
          // Ensure sum of line items equals transaction amount
          const lineItemsTotal = parseFloat(
            lineItems.reduce((acc, lineItem) => acc + lineItem.amount, 0).toFixed(2),
          )
          return lineItemsTotal === getValues('amount')
        },
      },
    })

    // Watch Form & Calculate Remaining Amount
    const lineItems = watch('lineItems')
    const isSplit = lineItems.length > 1
    const totalAmount = watch('amount')
    const remaining = parseFloat(
      (totalAmount - lineItems.reduce((acc, lineItem) => acc + lineItem.amount, 0)).toFixed(2),
    )
    const firstLineItemAmount = lineItems[0]?.amount

    // Update total if unsplit line item amount updated
    React.useEffect(() => {
      if (!isSplit) {
        setValue('amount', firstLineItemAmount ?? 0, { shouldValidate: true, shouldDirty: true })
      }
    }, [isSplit, firstLineItemAmount, setValue])

    /**
     * Callback to handle saving Form
     */
    const onSubmit = (formData: FormData) => {
      table.options.meta?.transactionsTable?.updateRows([row.original], {
        date: formData.date,
        title: formData.title,
        amount: formData.amount,
        is_reviewed: formData.is_reviewed,
        splits: formData.lineItems,
      })
      table.options.meta?.transactionsTable?.toggleEditMode(row.id, false)
    }

    // Calculate Edit Form Column Spans
    const allVisibleFields = row.getVisibleCells().map((cell) => cell.column.id)
    // Render Transaction fields 'date', 'title', 'amount', 'balance', 'is_reviewed' at top of form
    const transactionFields = [
      'date',
      'title',
      'balance',
      'is_reviewed',
      ...(isSplit ? ['amount'] : []),
    ]
    // Caculate colspan for payee field at top of form
    const payeeFieldColSpan = allVisibleFields.reduce(
      (count, column) => count - (transactionFields.includes(column) && column != 'title' ? 1 : 0),
      allVisibleFields.length,
    )

    // Render row in Edit Mode
    return (
      <React.Fragment>
        {/* First Row - Render only date, payee, total amount and balance */}
        <TableRow ref={ref} className={clsx(className, 'isEditing')}>
          {row.getVisibleCells().map((cell) => (
            <React.Fragment key={cell.id}>
              {transactionFields.includes(cell.column.id) && (
                <TableCell
                  style={{
                    width: cell.column.getSize(),
                    padding: cell.column.id === 'balance' ? 10 : undefined,
                  }}
                  colSpan={cell.column.id === 'title' ? payeeFieldColSpan : 1}
                >
                  {cell.column.columnDef.meta?.transactionsTable?.editCell(
                    cell.column.id as FieldPath<FormData>,
                    control,
                    table,
                  ) ??
                    flexRender(
                      cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                </TableCell>
              )}
            </React.Fragment>
          ))}
        </TableRow>

        {/* Next Row - Render line items */}

        {fields.map((_, index) => {
          // Render line item
          return (
            <TableRow key={index} className={clsx(className, 'isEditing')}>
              {row.getVisibleCells().map((cell) => {
                switch (cell.column.id) {
                  case 'category':
                    return (
                      <TableCell
                        key={`${index}-${cell.id}`}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {isSplit ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              width: '100%',
                            }}
                          >
                            <CloseButton
                              onClick={() => {
                                if (fields.length == 2) {
                                  // If we're undoing a split, make sure total amount is copied to first line item
                                  // to avoid wierd behaviour of total amount changing if you delete the last line item
                                  setValue('lineItems.0.amount', getValues('amount'))
                                }
                                remove(index)
                              }}
                              small={true}
                            />
                            <div style={{ flex: 1 }}>
                              {cell.column.columnDef.meta?.transactionsTable?.editCell?.(
                                `lineItems.${index}.account_id`,
                                control,
                                table,
                              )}
                            </div>
                          </div>
                        ) : (
                          cell.column.columnDef.meta?.transactionsTable?.editCell(
                            `lineItems.${index}.account_id`,
                            control,
                            table,
                          )
                        )}
                      </TableCell>
                    )
                  case 'tags':
                    return (
                      <TableCell
                        key={`${index}-${cell.id}`}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {cell.column.columnDef.meta?.transactionsTable?.editCell(
                          `lineItems.${index}.tags`,
                          control,
                          table,
                        )}
                      </TableCell>
                    )
                  case 'notes':
                    return (
                      <TableCell key={`${index}-${cell.id}`} style={{}}>
                        {cell.column.columnDef.meta?.transactionsTable?.editCell(
                          `lineItems.${index}.note`,
                          control,
                          table,
                        )}
                      </TableCell>
                    )
                  case 'amount':
                    return (
                      <TableCell
                        key={`${index}-${cell.id}`}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {cell.column.columnDef.meta?.transactionsTable?.editCell(
                          `lineItems.${index}.amount`,
                          control,
                          table,
                        )}
                      </TableCell>
                    )
                  case 'balance':
                    return (
                      <TableCell
                        key={`${index}-${cell.id}`}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      />
                    )
                  case 'title':
                  case 'date':
                  case 'is_reviewed':
                  case 'owner':
                  case 'account':
                    return (
                      <TableCell
                        key={`${index}-${cell.id}`}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      />
                    )
                  default:
                    // Do not render other columns
                    return null
                }
              })}
            </TableRow>
          )
        })}

        {/* Next Row - Render split button/total */}

        <TableRow className={clsx(className, 'isEditing')}>
          {row.getVisibleCells().map((cell) => {
            switch (cell.column.id) {
              case 'category':
                return (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    <Button
                      sx={{ mr: 2 }}
                      variant="text"
                      onClick={() =>
                        append({
                          account_id: undefined,
                          amount: 0,
                          note: '',
                          tags: [],
                        })
                      }
                    >
                      {isSplit ? 'Add Split...' : 'Split Transaction...'}
                    </Button>
                  </TableCell>
                )
              case 'amount':
                return (
                  <TableCell
                    key={cell.id}
                    className={clsx('amountLeft', remaining != 0 && 'notZero')}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {isSplit && (
                      <>
                        <CurrencyLabel value={remaining} currency={row.original.currency} />
                        <br />
                        Left to Split
                      </>
                    )}
                  </TableCell>
                )
              default:
                // Render empty filler cell
                return (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  />
                )
            }
          })}
        </TableRow>

        {/* Last Row - Render Cancel/Save buttons */}

        <TableRow className={clsx(className, 'isEditing')}>
          <TableCell
            colSpan={row.getVisibleCells().length}
            sx={{
              textAlign: 'right',
              borderBottom: (theme) => `1px solid ${theme.palette.primary.main} !important`,
              padding: `10px !important`,
            }}
          >
            {!row.original.isNew && (
              <Button
                sx={{ mr: 2, backgroundColor: (theme) => theme.palette.error.main }}
                onClick={() => table.options.meta?.transactionsTable?.deleteRows([row.original])}
              >
                Delete
              </Button>
            )}
            <Button
              sx={{ mr: 2 }}
              variant="outlined"
              onClick={() => {
                if (row.original.isNew) {
                  table.options.meta?.transactionsTable?.removeNewRow()
                } else {
                  table.options.meta?.transactionsTable?.toggleEditMode(row.id, false)
                }
              }}
            >
              Cancel
            </Button>
            <Button sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)} disabled={!isValid || !isDirty}>
              Save
            </Button>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  },
)
