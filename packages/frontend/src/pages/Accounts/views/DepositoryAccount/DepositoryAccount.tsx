import type { FC } from 'react'

import { TransactionsTable } from '@/components/TransactionsTable'
import { Chart } from '../../components/Chart'
import type { DepositoryAccountProps } from './DepositoryAccount.interface'

/**
 * Main Component: View for Depository Account types such as Checking/Savings
 */

const DepositoryAccount: FC<DepositoryAccountProps> = ({
  account,
  transactions,
  accountsWithRelations,
  tags,
  onCreateCategory,
  onDeleteTransaction,
  onSaveTransactions,
  onImportTransactions,
}) => {
  return (
    <div>
      <Chart account={account} transactions={transactions} />

      <TransactionsTable
        id="DepositoryAccountsTableState"
        account={account}
        transactions={transactions}
        accountsWithRelations={accountsWithRelations}
        allTags={tags}
        onCreateCategory={onCreateCategory}
        onDeleteTransaction={onDeleteTransaction}
        onSaveTransactions={onSaveTransactions}
        onImportTransactions={onImportTransactions}
        scrollElement={document.getElementById('app-viewport') as HTMLDivElement}
        showFilterBar
      />
    </div>
  )
}

export default DepositoryAccount
