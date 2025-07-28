import Box from '@mui/material/Box'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TransactionsTable } from '.'

// Mock Data
import type { IAccount, ITag, ITransaction, ITransactionUpdate } from '@angelfish/core'
import {
  getAccountsWithRelations,
  getLongTransactions,
  tags,
  transactions,
} from '@angelfish/tests/fixtures'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Transactions Table',
  component: TransactionsTable,
  args: {
    account: getAccountsWithRelations()[121] as IAccount,
    accountsWithRelations: getAccountsWithRelations(),
    allTags: tags,
    scrollElement: undefined,
    onCreateCategory: (name?: string) => action('onCreateCategory')(name),
    onDeleteTransaction: (id: number) => action('onDeleteTransaction')(id),
    onSaveTransactions: (items: ITransactionUpdate[]) => action('onSaveTransactions')(items),
    onImportTransactions: () => action('onImportTransactions')(),
  },
  render: ({
    scrollElement,
    transactions,
    onSaveTransactions,
    onDeleteTransaction,
    allTags,
    ...args
  }) => {
    const RenderComponent = () => {
      // Keep state of transactions so user can edit transactions while testing story
      const [updatedTransactions, setUpdatedTransactions] = React.useState(transactions)
      // Keep state of tags as we add tags
      const [updatedTags, setUpdatedTags] = React.useState(allTags)

      const saveTransactions = (items: ITransactionUpdate[]) => {
        onSaveTransactions(items)
        const state = structuredClone(updatedTransactions)
        for (const transaction of items) {
          // See if Transaction is already in store, if not will return -1
          const index = state.findIndex((t) => t.id === transaction.id)
          if (index > -1) {
            // Replace Transaction with updated Transaction
            transaction.modified_on = new Date()
            state.splice(index, 1, structuredClone(transaction as ITransaction))
          } else {
            // Generate new ID if Transaction is new
            if (!transaction.id) {
              transaction.id = 2001 + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER - 2000)
            }
            // Add Transaction to store
            transaction.created_on = new Date()
            transaction.modified_on = new Date()
            state.push(transaction as ITransaction)
          }
          setUpdatedTransactions(state)

          // Update Tags if they have changed
          if (transaction.line_items) {
            transaction.line_items.forEach((lineItem) => {
              if (lineItem.tags) {
                lineItem.tags.forEach((tag) => {
                  // If tag does not have an ID, generate one and add to updatedTags
                  if (!tag.id) {
                    tag.id = 1000 + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER - 1000)
                    tag.created_on = new Date()
                    tag.modified_on = new Date()
                    tag.name = tag.name?.trim()
                  }
                  if (!updatedTags.some((t) => t.id === tag.id)) {
                    setUpdatedTags((prevTags) => [...prevTags, tag as ITag])
                  }
                })
              }
            })
          }
        }
      }
      const deleteTransaction = (id: number) => {
        onDeleteTransaction(id)
        const state = structuredClone(updatedTransactions)
        const index = state.findIndex((t) => t.id === id)
        if (index > -1) {
          state.splice(index, 1)
          setUpdatedTransactions(state)
        }
      }

      // Virtualized Table
      const [divScrollElement, setDivScrollElement] = React.useState<HTMLDivElement | null>(null)
      React.useEffect(() => {
        setDivScrollElement(document.getElementById('table-viewport') as HTMLDivElement)
      }, [])

      return (
        <div
          id="table-viewport"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {divScrollElement && (
            <Box padding="20px">
              <TransactionsTable
                columns={[
                  'title',
                  'date',
                  'notes',
                  'category',
                  'owners',
                  'currency',
                  'amount',
                  'balance',
                  'tags',
                  'account',
                  'is_reviewed',
                ]}
                transactions={updatedTransactions}
                onSaveTransactions={saveTransactions}
                onDeleteTransaction={deleteTransaction}
                scrollElement={divScrollElement}
                allTags={updatedTags}
                {...args}
              />
            </Box>
          )}
        </div>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof TransactionsTable>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: { id: 'transactions-table-default', transactions, showFilterBar: true },
}

export const EmptyTable: Story = {
  args: {
    id: 'transactions-table-empty',
    transactions: [],
    showFilterBar: true,
  },
}

export const LongTable: Story = {
  args: {
    id: 'transactions-table-long',
    transactions: getLongTransactions(),
    showFilterBar: true,
  },
}
