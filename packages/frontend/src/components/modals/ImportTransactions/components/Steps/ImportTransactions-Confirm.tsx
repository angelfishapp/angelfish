import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

import { Step } from '@/components/Stepper'
import type { IAccount, ReconciledTransaction } from '@angelfish/core'
import { ReviewTransactionsTable } from '../ReviewTransactionsTable'

/**
 * Step Component Properties
 */
export interface ImportTransactionsConfirmProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Error message to display
   */
  error?: string
  /**
   * Array of reconciled Transactions to review before importing
   */
  transactions?: ReconciledTransaction[]
  /**
   * Callback when the cancel button is clicked
   */
  onCancel: () => void
  /**
   * Callback when the next button is clicked. Returns reviewed list
   * of Transactions to import.
   */
  onNext: (transactions: ReconciledTransaction[]) => void
}

/**
 * Step Component - 3. Review a list of reconciled transactions before they are
 * imported into database. This gives user opportunity to review and make any
 * corrections to reconciliation before importing
 */
export default function ImportTransactionsConfirm({
  accountsWithRelations,
  error,
  transactions,
  onCancel,
  onNext,
}: ImportTransactionsConfirmProps) {
  // Keep track of updated transactions
  const [updatedTransactions, setUpdatedTransactions] = React.useState<
    ReconciledTransaction[] | undefined
  >(transactions)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Make sure to update transactions if they change
  React.useEffect(() => {
    setUpdatedTransactions(transactions)
  }, [transactions])

  // Update the count of transactions to import
  const importCount = updatedTransactions?.filter((t) => t.import).length ?? 0

  // Render
  return (
    <Step
      title="Review Transactions"
      nextStep={`Import ${importCount} Transactions`}
      isReady={true}
      onNext={() => onNext(updatedTransactions ?? [])}
      onCancel={onCancel}
    >
      {error && (
        <Box sx={{ color: 'error.main', textAlign: 'center', marginBottom: 2 }}>{error}</Box>
      )}
      <div
        style={{
          height: 400,
          width: '100%',
          overflowY: 'auto',
          border: '1px solid #ccc',
        }}
        ref={scrollContainerRef}
      >
        {updatedTransactions === undefined ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReviewTransactionsTable
            transactions={updatedTransactions}
            accountsWithRelations={accountsWithRelations}
            onUpdateTransactions={(updatedTransactions) => {
              setUpdatedTransactions(updatedTransactions)
            }}
            scrollElement={scrollContainerRef.current}
          />
        )}
      </div>
    </Step>
  )
}
