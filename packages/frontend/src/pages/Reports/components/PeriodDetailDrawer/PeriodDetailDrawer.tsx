import React from 'react'

import { Drawer } from '@/components/Drawer'
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
}: PeriodDetailDrawerProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Render
  return (
    <Drawer title={title} position="bottom" onClose={onClose} open={open} hideBackdrop={true}>
      <div
        ref={scrollContainerRef}
        style={{
          position: 'relative',
          top: 16,
          height: 468,
          margin: -15,
          overflow: 'auto',
          marginLeft: 0,
        }}
      >
        {scrollContainerRef.current && (
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
        )}
      </div>
    </Drawer>
  )
}
