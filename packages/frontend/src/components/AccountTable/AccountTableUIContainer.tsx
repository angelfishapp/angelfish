import DialogContentText from '@mui/material/DialogContentText'
import React from 'react'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { BankAccountDrawer } from '@/components/drawers/BankAccountDrawer'
import { InstitutionDrawer } from '@/components/drawers/InstitutionDrawer'
import type { IAccount, IInstitution } from '@angelfish/core'
import { getCountryFromCode } from '@angelfish/core'
import AccountTable from './AccountTable'
import type {
  AccountTableMethods,
  AccountTableUIContainerProps,
} from './AccountTableUIContainer.interface'

/**
 * Container for the Account Table Component. Handles all UI logic for the  Account Table.
 *
 * Contains BankAccountDrawer, InstitutionDrawer and ConfirmDialog components which
 * are opened when a user edits, creates or deletes Account/Institution.
 */
export default React.forwardRef<AccountTableMethods, AccountTableUIContainerProps>(
  function AccountTableUIContainer(
    {
      accountsWithRelations,
      book_default_currency,
      disableContextMenu,
      institutions,
      users,
      groupBy,
      selectedAccountId,
      showClosedAccounts,
      sortBy,
      onSelectAccount,
      onSaveAccount,
      onDeleteAccount,
      onSaveInstitution,
      onDeleteInstitution,
      onSearchInstitutions,
    }: AccountTableUIContainerProps,
    ref: React.Ref<AccountTableMethods>,
  ) {
    // Component State
    const [selectedInstitution, setSelectedInstitution] = React.useState<IInstitution | undefined>(
      undefined,
    )
    const [showInstitutionDrawer, setShowInstitutionDrawer] = React.useState<boolean>(false)
    const [showInstitutionDeleteModal, setShowInstitutionDeleteModal] =
      React.useState<boolean>(false)
    const [selectedAccount, setSelectedAccount] = React.useState<Partial<IAccount> | undefined>(
      undefined,
    )
    const [showAccountDrawer, setShowAccountDrawer] = React.useState<boolean>(false)
    const [showAccountDeleteModal, setShowAccountDeleteModal] = React.useState<boolean>(false)

    /**
     * Callback to create a new Bank Account
     */
    const onAddBankAccount = React.useCallback(
      (institution?: IInstitution) => {
        setSelectedAccount({
          class: 'ACCOUNT',
          institution,
          acc_iso_currency: getCountryFromCode(institution?.country || '')?.currency,
          acc_is_open: true,
          acc_start_balance: 0,
          acc_limit: 0,
        })
        setShowAccountDrawer(true)
      },
      [setSelectedAccount, setShowAccountDrawer],
    )

    /**
     * Callback to create a new Institution
     */
    const onAddInstitution = React.useCallback(() => {
      setSelectedInstitution(undefined)
      setShowInstitutionDrawer(true)
    }, [setSelectedInstitution, setShowInstitutionDrawer])

    // Ref Table Methods Forwarding
    React.useImperativeHandle(ref, () => ({
      addBankAccount: () => onAddBankAccount(),
      addInstitution: () => onAddInstitution(),
    }))

    return (
      <React.Fragment>
        <AccountTable
          accountsWithRelations={accountsWithRelations}
          book_default_currency={book_default_currency}
          disableContextMenu={disableContextMenu}
          institutions={institutions}
          selectedAccountId={selectedAccountId}
          onSelectAccount={(account) => {
            setSelectedAccount(account)
            onSelectAccount(account)
          }}
          onCreateAccount={onAddBankAccount}
          onEditAccount={(account) => {
            setSelectedAccount(account)
            setShowAccountDrawer(true)
          }}
          onDeleteAccount={(account) => {
            setSelectedAccount(account)
            setShowAccountDeleteModal(true)
          }}
          onSelectInstitution={(institution) => {
            setSelectedInstitution(institution)
          }}
          onCreateInstitution={onAddInstitution}
          onEditInstitution={(institution) => {
            setSelectedInstitution(institution)
            setShowInstitutionDrawer(true)
          }}
          onDeleteInstitution={(institution) => {
            setSelectedInstitution(institution)
            setShowInstitutionDeleteModal(true)
          }}
          groupBy={groupBy}
          sortBy={sortBy}
          showClosedAccounts={showClosedAccounts}
        />
        <InstitutionDrawer
          initialValue={selectedInstitution}
          open={showInstitutionDrawer}
          onClose={() => setShowInstitutionDrawer(false)}
          onSave={(updatedInstitution) => onSaveInstitution(updatedInstitution)}
          onRemove={() => setShowInstitutionDeleteModal(true)}
          onSearch={onSearchInstitutions}
        />
        <ConfirmDialog
          title={`Delete ${selectedInstitution?.name}`}
          confirmText="Delete Institution & All Its Accounts & Transactions"
          confirmButtonColor="error"
          onConfirm={() => {
            onDeleteInstitution(selectedInstitution as IInstitution)
            setShowInstitutionDeleteModal(false)
            setSelectedInstitution(undefined)
          }}
          onClose={() => setShowInstitutionDeleteModal(false)}
          open={showInstitutionDeleteModal}
        >
          <DialogContentText>
            Are you sure you want to delete the Institution <em>{selectedInstitution?.name}</em>{' '}
            from Angelfish? This will also delete any accounts and all their transactions that
            belong to this Institution and cannot be undone.
          </DialogContentText>
        </ConfirmDialog>
        <BankAccountDrawer
          initialValue={selectedAccount}
          open={showAccountDrawer}
          onClose={() => setShowAccountDrawer(false)}
          onSave={(updatedAccount) => onSaveAccount(updatedAccount)}
          institutions={institutions}
          users={users}
        />
        <ConfirmDialog
          title={`Delete ${selectedAccount?.name}`}
          confirmText="Delete Account & All Its Transactions"
          confirmButtonColor="error"
          onConfirm={() => {
            onDeleteAccount(selectedAccount as IAccount)
            setShowAccountDeleteModal(false)
            setSelectedAccount(undefined)
          }}
          onClose={() => setShowAccountDeleteModal(false)}
          open={showAccountDeleteModal}
        >
          <DialogContentText>
            Are you sure you want to delete the Account <em>{selectedAccount?.name}</em> from
            Angelfish? This will also delete any account transactions that belong to this Account
            and cannot be undone.
          </DialogContentText>
        </ConfirmDialog>
      </React.Fragment>
    )
  },
)
