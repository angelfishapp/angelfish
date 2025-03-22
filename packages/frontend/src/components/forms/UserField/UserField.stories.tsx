import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { users as userData } from '@angelfish/tests/fixtures'

import { UserField } from '.'

const meta = {
  title: 'Components/Forms/User Field',
  component: UserField,
  args: {
    users: userData,
    fullWidth: true,
    onChange: (account) => action('onChange')(account),
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <UserField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof UserField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'User Field',
  },
}
