import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { AccountTableUIContainer } from '.'
import { SideMenu } from '../SideMenu'

// Mock Data
import type { IAccount } from '@angelfish/core'
import {
  getBankAccountsWithRelations,
  institutions,
  searchInstitutions,
} from '@angelfish/tests/fixtures'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Account Table',
  component: AccountTableUIContainer,
  args: {
    users: [],
    onSelectAccount: (account) => action('onSelectAccount')(account),
    onSaveAccount: (account) => action('onSaveAccount')(account),
    onDeleteAccount: (account) => action('onDeleteAccount')(account),
    onSaveInstitution: (institution) => action('onEditInstitution')(institution),
    onDeleteInstitution: (institution) => action('onDeleteInstitution')(institution),
    onSearchInstitutions: searchInstitutions,
  },
  render: ({ onSelectAccount, ...args }) => {
    const RenderComponent = () => {
      const [selectedAccount, setSelectedAccount] = React.useState<IAccount | undefined>(undefined)

      return (
        <div style={{ margin: 20 }}>
          <SideMenu id="storybook-account-table">
            <AccountTableUIContainer
              selectedAccountId={selectedAccount?.id}
              onSelectAccount={(account) => {
                onSelectAccount(account)
                setSelectedAccount(account)
              }}
              {...args}
            />
          </SideMenu>
        </div>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof AccountTableUIContainer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    accountsWithRelations: getBankAccountsWithRelations(),
    book_default_currency: 'USD',
    institutions,
    groupBy: 'acc_institution',
    sortBy: 'name',
    showClosedAccounts: true,
  },
}

export const Empty: Story = {
  args: {
    accountsWithRelations: [],
    book_default_currency: 'USD',
    institutions: [],
  },
}
