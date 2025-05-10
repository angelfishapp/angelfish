import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { USER_AVATARS } from '@angelfish/core'
import { users } from '@angelfish/tests/fixtures'
import { UserDrawer } from '.'

const meta = {
  title: 'Components/Drawers/User',
  component: UserDrawer,
  args: {
    avatars: USER_AVATARS,
    onSave: (user) => action('onSave')(user),
    onClose: () => action('onClose')(),
  },
  render: ({ ...args }) => <UserDrawer {...args} />,
} satisfies Meta<typeof UserDrawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const UpdateUser: Story = {
  args: {
    open: true,
    initialValue: users[0],
  },
}

export const AddNewUser = {
  args: {
    open: true,
  },
}
