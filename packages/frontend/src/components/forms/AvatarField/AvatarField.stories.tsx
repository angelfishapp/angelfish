import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { BOOK_AVATARS, USER_AVATARS } from '@angelfish/core'
import { users } from '@angelfish/tests/fixtures'
import AvatarField from './AvatarField'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Forms/Avatar Field',
  component: AvatarField,
  args: {
    onChange: (account) => action('onSelectAccount')(account),
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentAvatar, setCurrentAvatar] = React.useState(value)

      return (
        <Paper>
          <AvatarField
            onChange={(avatar) => {
              onChange?.(avatar)
              setCurrentAvatar(avatar)
            }}
            value={currentAvatar}
            {...args}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof AvatarField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Avatar Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    size: 100,
    dialogSize: 60,
    dialogTitle: 'Pick Your Avatar',
    helperText: 'Here is some helper text',
    value: users[0].avatar,
    avatars: USER_AVATARS,
  },
}

export const NoAvatar: Story = {
  args: {
    label: 'Avatar Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
    value: undefined,
    avatars: USER_AVATARS,
  },
}

export const Logo: Story = {
  args: {
    label: 'Logo Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    size: 150,
    dialogSize: 150,
    dialogTitle: 'Pick Your Household Logo',
    helperText: 'Here is some helper text',
    value: BOOK_AVATARS[0],
    avatars: BOOK_AVATARS,
  },
}
