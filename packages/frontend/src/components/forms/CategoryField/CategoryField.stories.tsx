import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { getAccountsWithRelations } from '@angelfish/tests/fixtures'

import { CategoryField } from '.'

const meta = {
  title: 'Components/Forms/Category Field',
  component: CategoryField,
  args: {
    accountsWithRelations: getAccountsWithRelations(),
    onChange: (account) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <CategoryField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof CategoryField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Category',
    onCreate: (name?) => action('onCreate')(name),
    variant: 'dropdown',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Category',
    value: getAccountsWithRelations()[2],
    onCreate: (name?) => action('onCreate')(name),
    variant: 'dropdown',
  },
}

export const ShowAsTextField: Story = {
  args: {
    label: 'Category',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
    variant: 'dropdown',
  },
}

export const Filtered: Story = {
  args: {
    label: 'Bank Accounts',
    filter: (account) => account.class === 'ACCOUNT',
    disableGroupBy: true,
    disableTooltip: true,
    placeholder: 'Search Bank Accounts...',
    variant: 'dropdown',
  },
}
export const multiBox: Story = {
  args: {
    label: 'Category',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
    variant: 'multi-box',
  },
}
