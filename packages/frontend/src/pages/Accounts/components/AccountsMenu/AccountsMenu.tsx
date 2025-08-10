import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import React from 'react'

import type { AccountTableMethods, AccountTableProps } from '@/components/AccountTable'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { SideMenu } from '@/components/SideMenu'
import { AccountTableContainer } from '@/containers/AccountTableContainer'
import { useI18n } from '@/utils/i18n/I18nProvider'
import type { IAccount } from '@angelfish/core'
import type { AccountsMenuProps } from './AccountsMenu.interface'

export default function AccountsMenu({
  disableAddAccount = false,
  onSelectAccount,
}: AccountsMenuProps) {
  // Component State
  const [selectedAccount, setSelectedAccount] = React.useState<IAccount | undefined>()
  const [groupBy, setGroupBy] = React.useState<AccountTableProps['groupBy']>('acc_institution')
  const [sortBy, setSortBy] = React.useState<AccountTableProps['sortBy']>('name')
  const [showClosedAccounts, setShowClosedAccounts] = React.useState<boolean>(false)
  const [menuWidth, setMenuWidth] = React.useState<number>(0)
  const accountTableMethodsRef = React.useRef<AccountTableMethods>(null)
  const { localeData } = useI18n()

  // Render
  return (
    <SideMenu id="accounts-page-menu" sticky onResize={(width) => setMenuWidth(width)}>
      {/* View Settings Dropdown */}
      <Box>
        <Box
          sx={{
            textAlign: 'end',
            height: 50,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <DropdownMenuButton
            variant="text"
            label={localeData?.translations.frontEnd.accounts.viewSettings}
            position={{ vertical: 'bottom', horizontal: 'left' }}
            menuItems={[
              { label: localeData?.translations.frontEnd.accounts.groupBy },
              {
                label: localeData?.translations.frontEnd.accounts.institution,
                icon: groupBy === 'acc_institution' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_institution'),
              },
              {
                label: localeData?.translations.frontEnd.accounts.country,
                icon: groupBy === 'acc_country' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_country'),
              },
              {
                label: localeData?.translations.frontEnd.accounts.currency,
                icon: groupBy === 'acc_currency' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_currency'),
              },
              {
                label: localeData?.translations.frontEnd.accounts.accountOwner,
                icon: groupBy === 'acc_owners' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_owners'),
              },
              {
                label: localeData?.translations.frontEnd.accounts.accountType,
                icon: groupBy === 'acc_type' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_type'),
                divider: true,
              },
              { label: localeData?.translations.frontEnd.accounts.sortBy },
              {
                label: localeData?.translations.frontEnd.accounts.sortAZ,
                icon: sortBy === 'name' ? CheckIcon : undefined,
                onClick: () => setSortBy('name'),
              },
              {
                label: localeData?.translations.frontEnd.accounts.accountBalance,
                icon: sortBy === 'current_balance' ? CheckIcon : undefined,
                onClick: () => setSortBy('current_balance'),
                divider: true,
              },
              {
                label: localeData?.translations.frontEnd.accounts.showClosedAccounts,
                icon: showClosedAccounts ? CheckIcon : undefined,
                onClick: () => setShowClosedAccounts(!showClosedAccounts),
              },
            ]}
          />
        </Box>
        {/* END OF View Settings Dropdown */}

        <Box
          sx={{
            maxHeight: 'calc(100vh - 150px)',
            overflowY: 'auto',
          }}
        >
          <AccountTableContainer
            ref={accountTableMethodsRef}
            onSelectAccount={(account) => {
              setSelectedAccount(account)
              onSelectAccount(account)
            }}
            selectedAccountId={selectedAccount?.id}
            groupBy={groupBy}
            sortBy={sortBy}
            showClosedAccounts={showClosedAccounts}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: (theme) => theme.spacing(1),
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <DropdownMenuButton
            variant="contained"
            color="primary"
            label="Add..."
            fullWidth
            menuWidth={menuWidth}
            position={{ vertical: -90, horizontal: 'left' }}
            menuItems={[
              {
                label: 'Add Institution',
                onClick: () => {
                  accountTableMethodsRef.current?.addInstitution()
                },
              },
              {
                label: 'Add Account',
                disabled: disableAddAccount,
                onClick: () => {
                  accountTableMethodsRef.current?.addBankAccount()
                },
              },
            ]}
          />
        </Box>
      </Box>
    </SideMenu>
  )
}
