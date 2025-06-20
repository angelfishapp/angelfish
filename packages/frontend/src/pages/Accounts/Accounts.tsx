import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import type { IAccount, ITransactionUpdate } from '@angelfish/core'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import { CategoryDrawer } from '@/components/drawers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ImportTransactionsContainer } from '@/containers/ImportTransactionsContainer'

import {
  useDeleteTransaction,
  useListAllAccountsWithRelations,
  useListCategoryGroups,
  useListInstitutions,
  useListTags,
  useListTransactions,
  useSaveAccount,
  useSaveTransactions,
} from '@/hooks'
import { AccountsMenu } from './components/AccountsMenu'
import { AccountsView } from './views/AccountsView'

/**
 * Main Accounts page for viewing and editing Accounts and their associated Transactions
 */
export default function Accounts() {
  // Accounts custom hooks to handle Transactions
  const { accounts, isLoading: isAccountLoading } = useListAllAccountsWithRelations()
  const accountSaveMutation = useSaveAccount()

  const { institutions } = useListInstitutions()

  const { tags } = useListTags()
  const { categoryGroups } = useListCategoryGroups()

  // Bank Account Menu State
  const [selectedAccount, setSelectedAccount] = React.useState<IAccount>()

  // Transactions custom hooks to handle Transactions
  const { transactions, isLoading, error } = useListTransactions({
    account_id: selectedAccount?.id,
  })
  const transactionSaveMutation = useSaveTransactions()
  const transactionDeleteMutation = useDeleteTransaction()

  // Create Category State
  const [showCreateCategoryDrawer, setShowCreateCategoryDrawer] = React.useState<boolean>(false)
  const [createCategoryName, setCreateCategoryName] = React.useState<string | undefined>()

  // Import Transactions Modal State
  const [showImportTransactionsModal, setShowImportTransactionsModal] =
    React.useState<boolean>(false)

  /**
   * Make sure selected Account is updated if Redux Accounts are updated in case user
   * edited the Account details
   */
  React.useEffect(() => {
    if (selectedAccount) {
      const filteredAccounts = accounts?.filter((account) => account.id == selectedAccount.id)
      if (filteredAccounts.length > 0) {
        const currentAccount = filteredAccounts[0]
        if (currentAccount !== selectedAccount) {
          setSelectedAccount(currentAccount)
        }
      } else {
        // Account may have been deleted
        setSelectedAccount(undefined)
      }
    }
  }, [accounts, selectedAccount])

  /**
   * Callback to handle switching between accounts
   */
  const onSelectAccount = React.useCallback(
    (account?: IAccount) => {
      if (account) {
        const filteredAccounts = accounts?.filter((a) => a.id == account.id)
        if (filteredAccounts?.length > 0) {
          const currentAccount = filteredAccounts[0]
          if (currentAccount !== selectedAccount) {
            setSelectedAccount(currentAccount)
          }
        } else {
          // Account may have been deleted
          setSelectedAccount(undefined)
        }
      }
    },
    [setSelectedAccount, accounts, selectedAccount],
  )

  /**
   * Callback to save a Transaction to the Database
   */
  const onSaveTransactions = React.useCallback(
    async (transactions: ITransactionUpdate[]) => {
      transactionSaveMutation.mutate(transactions)
    },
    [transactionSaveMutation],
  )

  /**
   * Delete a Transaction from the Database
   */
  const onDeleteTransaction = async (id: number) => {
    transactionDeleteMutation.mutate({ id })
  }

  /**
   * Callback to save new Category (Account) to the Database
   */
  const onSaveCategory = async (category: IAccount) => {
    setShowCreateCategoryDrawer(false)
    accountSaveMutation.mutate(category)
  }

  /**
   * Return Loading Spinner if Accounts are still loading
   */
  if (isAccountLoading) return <LoadingSpinner />

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        alignContent: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingX: 1,
      }}
    >
      <Box
        sx={{
          order: 0,
          flex: '0 0 auto',
          alignSelf: 'auto',
          paddingY: 2,
          paddingX: 1,
        }}
      >
        {/* Accounts Side Menu */}
        <AccountsMenu
          disableAddAccount={institutions && institutions.length === 0}
          onSelectAccount={onSelectAccount}
        />
        {/* END OF Accounts Side Menu */}
      </Box>
      <Box
        sx={{
          order: 1,
          flex: '1 1 auto',
          alignSelf: 'auto',
          paddingY: 2,
          paddingX: 1,
        }}
      >
        {/* Account Page Header */}
        <Box display="flex" marginBottom={1} marginRight={2}>
          <Box display="flex" flexGrow={1}>
            {selectedAccount && (
              <Typography variant="h5" sx={{ color: (theme) => theme.palette.common.white }} noWrap>
                {selectedAccount.institution?.name} &gt; {selectedAccount.name}
              </Typography>
            )}
          </Box>

          <Box
            textAlign="right"
            sx={{
              '& .headerCurrencyLabel': {
                display: 'inline',
                color: (theme) => theme.palette.common.white,
                fontSize: (theme) => theme.typography.h5.fontSize,
              },
            }}
          >
            {selectedAccount && (
              <>
                <Typography
                  variant="h5"
                  sx={{ color: (theme) => theme.palette.common.white }}
                  component="span"
                >
                  Current Balance:
                </Typography>
                &nbsp;
                <CurrencyLabel
                  className="headerCurrencyLabel"
                  value={selectedAccount.current_balance}
                  currency={selectedAccount.acc_iso_currency}
                />
              </>
            )}
          </Box>
        </Box>
        {/* END OF Account Page Header */}

        <AccountsView
          account={selectedAccount}
          accountsWithRelations={accounts}
          error={error}
          isLoading={isLoading}
          transactions={transactions}
          tags={tags}
          onCreateCategory={(name?) => {
            setShowCreateCategoryDrawer(true)
            setCreateCategoryName(name)
          }}
          onDeleteTransaction={onDeleteTransaction}
          onSaveTransaction={onSaveTransactions}
          onImportTransactions={() => setShowImportTransactionsModal(true)}
        />

        {/* Create Category Drawer */}
        {showCreateCategoryDrawer && (
          <CategoryDrawer
            // @ts-ignore: TODO - Fix initial value type to be partial Account
            initialValue={{ id: undefined, name: createCategoryName ?? '', class: 'CATEGORY' }}
            categoryGroups={categoryGroups}
            onSave={onSaveCategory}
            onDelete={() => setShowCreateCategoryDrawer(false)}
          />
        )}

        {/* Import Transactions Modal */}
        <ImportTransactionsContainer
          defaultAccount={selectedAccount as IAccount}
          open={showImportTransactionsModal}
          onClose={() => setShowImportTransactionsModal(false)}
        />
      </Box>
    </Box>
  )
}
