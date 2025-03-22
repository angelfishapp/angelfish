import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { UserTableUIContainer } from '.'

// Mock Data
import type { IUser } from '@angelfish/core'
import { USER_AVATARS } from '@angelfish/core'
import { users as userData } from '@angelfish/tests/fixtures'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/User Table',
  component: UserTableUIContainer,
  args: {
    onSave: (user) => action('onSave')(user),
    onDelete: (id) => action('onDelete')(id),
    avatars: USER_AVATARS,
  },
  render: ({ users, onSave, onDelete, ...args }) => {
    const RenderComponent = () => {
      // Keep state of users so we can edit users while testing story
      const [updatedUsers, setUpdatedUsers] = React.useState(users)
      const saveUser = (user: IUser) => {
        onSave(user)
        const state = structuredClone(updatedUsers)
        if (state.length === 0) {
          // Handle adding first User
          user.id = 1
          state.push(user as IUser)
          setUpdatedUsers(state)
        } else {
          // See if User is already in store, if not will return -1
          const index = state.findIndex((u) => u.id === user.id)
          if (index > -1) {
            // Replace User with updated User
            state.splice(index, 1, structuredClone(user))
          } else {
            // Generate new ID if User is new
            if (!user.id) {
              // Find maximum ID and add 1 for Institutions
              const maxID = Math.max(...state.map((i) => i.id))
              user.id = maxID + 1
            }
            // Add User to store
            state.push(user)
          }
          setUpdatedUsers(state)
        }
      }
      const deleteUser = (id: number) => {
        const state = structuredClone(updatedUsers)
        const index = state.findIndex((u) => u.id === id)
        onDelete(updatedUsers[index])
        if (index > -1) {
          state.splice(index, 1)
          setUpdatedUsers(state)
        }
      }

      return (
        <Paper>
          <UserTableUIContainer
            users={updatedUsers}
            onSave={(user) => saveUser(user)}
            onDelete={(user) => deleteUser(user.id)}
            {...args}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof UserTableUIContainer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    users: userData,
    authenticated_user_id: '1b9291bb-4696-42d4-bd30-45df04989cba',
  },
}

export const Empty: Story = {
  args: {
    users: [],
    authenticated_user_id: '1b9291bb-4696-42d4-bd30-45df04989cba',
  },
}
