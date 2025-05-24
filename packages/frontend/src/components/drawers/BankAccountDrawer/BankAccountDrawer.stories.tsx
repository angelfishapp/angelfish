import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import {
  getAccountsWithRelations,
  institutions as INSTITUTIONS,
  users as USERS,
} from '@angelfish/tests/fixtures'
import { BankAccountDrawer } from '.'

const meta = {
  title: 'Components/Drawers/Bank Account',
  component: BankAccountDrawer,
  args: {
    users: USERS,
    institutions: INSTITUTIONS,
    onSave: (account) => action('onSave')(account),
    onClose: () => action('onClose')(),
  },
  render: ({ ...args }) => <BankAccountDrawer {...args} />,
} satisfies Meta<typeof BankAccountDrawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const UpdateBankAccount: Story = {
  args: {
    open: true,
    initialValue: getAccountsWithRelations()[122],
  },
}

export const AddNewBankAccount: Story = {
  args: {
    open: true,
  },
}

export const AddNewBankAccountWithInstitution: Story = {
  args: {
    open: true,
    initialValue: {
      institution: INSTITUTIONS[0],
    },
  },
}
