import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AvatarGroup from '@mui/material/AvatarGroup'
import type { Meta, StoryObj } from '@storybook/react'

import { users } from '@angelfish/tests/fixtures'
import { Avatar } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    size: 100,
  },
  render: ({ size, ...args }) => (
    <div
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
      }}
    >
      <Avatar size={size} {...args} />
      <AvatarGroup max={4} sx={{ width: 150, marginTop: 2 }}>
        <Avatar {...args} />
        <Avatar {...args} />
        <Avatar {...args} />
        <Avatar {...args} />
        <Avatar {...args} />
        <Avatar {...args} />
      </AvatarGroup>
    </div>
  ),
} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const WithAvatar: Story = {
  args: {
    avatar: users[0].avatar,
    firstName: users[0].first_name,
    lastName: users[0].last_name,
  },
}

export const InitialsAvatar: Story = {
  args: {
    firstName: 'John',
    lastName: 'Smith',
  },
}

export const JustAvatar: Story = {
  args: {
    avatar: users[0].avatar,
  },
}

export const CustomIcon: Story = {
  args: {
    avatar: undefined,
    displayBorder: true,
    Icon: AccountBalanceIcon,
  },
}

export const NoUserAvatar: Story = {
  args: {
    avatar: undefined,
    displayBorder: true,
  },
}
