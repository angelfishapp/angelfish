import type { FC } from 'react'

import { CreditAccount } from '../CreditAccount'
import { DepositoryAccount } from '../DepositoryAccount'
import { InvestmentAccount } from '../InvestmentAccount'
import { LoanAccount } from '../LoanAccount'
import { OtherAccount } from '../OtherAccount'
import type { AccountsViewProps } from './AccountsView.interface'

/**
 * Main Component: View selector for Account Types
 */

const AccountsView: FC<AccountsViewProps> = ({
  account,
  transactions,
  accountsWithRelations,
  tags,
  onCreateCategory,
  onDeleteTransaction,
  onSaveTransaction,
  onImportTransactions,
}) => {
  if (account) {
    switch (account.acc_type) {
      case 'depository':
        return (
          <DepositoryAccount
            account={account}
            transactions={transactions}
            accountsWithRelations={accountsWithRelations}
            tags={tags}
            onCreateCategory={onCreateCategory}
            onDeleteTransaction={onDeleteTransaction}
            onSaveTransactions={onSaveTransaction}
            onImportTransactions={onImportTransactions}
          />
        )
      case 'credit':
        return (
          <CreditAccount
            account={account}
            transactions={transactions}
            accountsWithRelations={accountsWithRelations}
            tags={tags}
            onCreateCategory={onCreateCategory}
            onDeleteTransaction={onDeleteTransaction}
            onSaveTransactions={onSaveTransaction}
            onImportTransactions={onImportTransactions}
          />
        )
      case 'investment':
        return (
          <InvestmentAccount
            account={account}
            transactions={transactions}
            accountsWithRelations={accountsWithRelations}
            tags={tags}
          />
        )
      case 'loan':
        return (
          <LoanAccount
            account={account}
            transactions={transactions}
            accountsWithRelations={accountsWithRelations}
            tags={tags}
          />
        )
      default:
        return (
          <OtherAccount
            account={account}
            transactions={transactions}
            accountsWithRelations={accountsWithRelations}
            tags={tags}
          />
        )
    }
  } else {
    // No Account Selected
    return null
  }
}

export default AccountsView
