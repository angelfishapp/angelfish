import type { FC } from 'react'

import { TransactionsTable } from '@/components/TransactionsTable'
import { Chart } from '../../components/Chart'
import type { CreditAccountProps } from './CreditAccount.interface'

/**
 * Main Component: View for Credit Account types such as Credit Cards
 */

const CreditAccount: FC<CreditAccountProps> = ({
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
        id="CreditAccountsTableState"
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

export default CreditAccount
