import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppCommandIds, CommandsClient } from '@angelfish/core'

import type { AccountTableMethods } from '@/components/AccountTable'
import { AccountTableUIContainer } from '@/components/AccountTable'
import type { AccountTableContainerProps } from './AccountTableContainer.interface'

import { deleteAccount, saveAccount } from '@/redux/accounts/actions'
import { selectAllAccountsWithRelations } from '@/redux/accounts/selectors'
import { selectBook } from '@/redux/app/selectors'
import { deleteInstitution, saveInstitution } from '@/redux/institutions/actions'
import { selectAllInstitutions } from '@/redux/institutions/selectors'
import { selectAllUsers } from '@/redux/users/selectors'

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
    // Redux State
    const dispatch = useDispatch()
    const accounts = useSelector(selectAllAccountsWithRelations)
    const institutions = useSelector(selectAllInstitutions)
    const users = useSelector(selectAllUsers)
    const book = useSelector(selectBook)

    /**
     * Callback to search available Institutions via API/Database
     */
    const onSearchInstitutions = React.useCallback(async (query: string) => {
      return await CommandsClient.executeAppCommand(AppCommandIds.SEARCH_INSTITUTIONS, { query })
    }, [])

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
        onSaveAccount={(account) => dispatch(saveAccount({ account }))}
        onDeleteAccount={(account) => dispatch(deleteAccount({ id: account.id as number }))}
        onSaveInstitution={(institution) => dispatch(saveInstitution({ institution }))}
        onDeleteInstitution={(institution) =>
          dispatch(deleteInstitution({ id: institution.id as number }))
        }
        onSearchInstitutions={onSearchInstitutions}
        groupBy={groupBy}
        sortBy={sortBy}
        showClosedAccounts={showClosedAccounts}
      />
    )
  },
)
