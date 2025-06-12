import React from 'react'

import { onSearchInstitutions } from '@/api'
import type { AccountTableMethods } from '@/components/AccountTable'
import { AccountTableUIContainer } from '@/components/AccountTable'
import {
  useDeleteAccount,
  useDeleteInstitution,
  useGetBook,
  useListAllAccountsWithRelations,
  useListInstitutions,
  useListUsers,
  useSaveAccount,
  useSaveInstitution,
} from '@/hooks'
import type { AccountTableContainerProps } from './AccountTableContainer.interface'

/**
 * Container for the Account Table Component. Handles all logic for the Account Table.
 *
 * Contains BankAccountDrawer, InstitutionDrawer and ConfirmDialog components which
 * are opened when a user edits, creates or deletes Account/Institution.
 */
export default React.forwardRef<AccountTableMethods, AccountTableContainerProps>(
  function AccountTableContainer(
    {
      groupBy,
      selectedAccountId,
      showClosedAccounts,
      sortBy,
      onSelectAccount,
    }: AccountTableContainerProps,
    ref: React.Ref<AccountTableMethods>,
  ) {
    // Database State
    const { accounts } = useListAllAccountsWithRelations()
    const { institutions } = useListInstitutions()
    const { users } = useListUsers()
    const { book } = useGetBook()
    const saveAccount = useSaveAccount()
    const deleteAccount = useDeleteAccount()
    const saveInstitution = useSaveInstitution()
    const deleteInstitution = useDeleteInstitution()

    // Render
    return (
      <AccountTableUIContainer
        ref={ref}
        accountsWithRelations={accounts}
        book_default_currency={book?.default_currency || 'USD'}
        institutions={institutions}
        users={users}
        selectedAccountId={selectedAccountId}
        onSelectAccount={onSelectAccount}
        onSaveAccount={(account) => saveAccount.mutate(account)}
        onDeleteAccount={(account) => deleteAccount.mutate({ id: account.id, reassignId: null })}
        onSaveInstitution={(institution) => saveInstitution.mutate(institution)}
        onDeleteInstitution={(institution) => deleteInstitution.mutate({ id: institution.id })}
        onSearchInstitutions={(query) => onSearchInstitutions({ query })}
        groupBy={groupBy}
        sortBy={sortBy}
        showClosedAccounts={showClosedAccounts}
      />
    )
  },
)
