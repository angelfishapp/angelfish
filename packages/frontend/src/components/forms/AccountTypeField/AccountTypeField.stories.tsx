import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { AccountTypeField } from '.'

const meta = {
  title: 'Components/Forms/Account Type Field',
  component: AccountTypeField,
  args: {
    onChange: (account) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => (
    <Paper>
      <AccountTypeField {...args} />
    </Paper>
  ),
} satisfies Meta<typeof AccountTypeField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Account Type Field',
    country: 'US',
  },
}
