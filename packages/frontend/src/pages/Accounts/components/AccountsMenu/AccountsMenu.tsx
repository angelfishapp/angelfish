import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import React from 'react'

import type { AccountTableMethods, AccountTableProps } from '@/components/AccountTable'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { SideMenu } from '@/components/SideMenu'
import { AccountTableContainer } from '@/containers/AccountTableContainer'
import type { IAccount } from '@angelfish/core'
import type { AccountsMenuProps } from './AccountsMenu.interface'

export default function AccountsMenu({ onSelectAccount }: AccountsMenuProps) {
  // Component State
  const [selectedAccount, setSelectedAccount] = React.useState<IAccount | undefined>()
  const [groupBy, setGroupBy] = React.useState<AccountTableProps['groupBy']>('acc_institution')
  const [sortBy, setSortBy] = React.useState<AccountTableProps['sortBy']>('name')
  const [showClosedAccounts, setShowClosedAccounts] = React.useState<boolean>(false)
  const [menuWidth, setMenuWidth] = React.useState<number>(0)
  const accountTableMethodsRef = React.useRef<AccountTableMethods>(null)

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
            label="View Settings"
            position={{ vertical: 'bottom', horizontal: 'left' }}
            menuItems={[
              { label: 'Group By' },
              {
                label: 'Institution',
                icon: groupBy === 'acc_institution' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_institution'),
              },
              {
                label: 'Country',
                icon: groupBy === 'acc_country' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_country'),
              },
              {
                label: 'Currency',
                icon: groupBy === 'acc_currency' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_currency'),
              },
              {
                label: 'Account Owner',
                icon: groupBy === 'acc_owners' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_owners'),
              },
              {
                label: 'Account Type',
                icon: groupBy === 'acc_type' ? CheckIcon : undefined,
                onClick: () => setGroupBy('acc_type'),
                divider: true,
              },
              { label: 'Sort By' },
              {
                label: 'A-Z',
                icon: sortBy === 'name' ? CheckIcon : undefined,
                onClick: () => setSortBy('name'),
              },
              {
                label: 'Account Balance',
                icon: sortBy === 'current_balance' ? CheckIcon : undefined,
                onClick: () => setSortBy('current_balance'),
                divider: true,
              },
              {
                label: 'Show Closed Accounts',
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
