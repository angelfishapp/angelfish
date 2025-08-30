import React from 'react'

import { Drawer } from '@/components/Drawer'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TransactionsTable } from '@/components/TransactionsTable'
import type { PeriodDetailDrawerProps } from './PeriodDetailDrawer.interface'

/**
 * Opens bottom Drawer with TransactionTable showing all the transactions
 * that make up that period's total on the ReportsTable.
 */

export default function PeriodDetailDrawer({
  accountsWithRelations,
  open = true,
  onClose,
  onCreateCategory,
  onDeleteTransaction,
  onSaveTransactions,
  tags,
  title,
  transactions,
  isLoading = false,
}: PeriodDetailDrawerProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Render
  return (
    <Drawer title={title} position="bottom" onClose={onClose} open={open} keepMounted={true}>
      <div
        ref={scrollContainerRef}
        style={{
          position: 'relative',
          height: 474,
          overflow: 'auto',
          marginLeft: 0,
          width: '100%',
        }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          scrollContainerRef.current && (
            <TransactionsTable
              id="reports-detail-drawer"
              columns={['date', 'title', 'category', 'notes', 'account', 'amount']}
              transactions={transactions}
              variant="flat"
              accountsWithRelations={accountsWithRelations}
              allTags={tags}
              onCreateCategory={onCreateCategory}
              onDeleteTransaction={onDeleteTransaction}
              onSaveTransactions={onSaveTransactions}
              scrollElement={scrollContainerRef.current}
            />
          )
        )}
      </div>
    </Drawer>
  )
}
