import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { BOOK_AVATARS, USER_AVATARS } from '@angelfish/core'
import {
  book,
  getAccountsWithRelations,
  institutions,
  searchInstitutions,
  users,
} from '@angelfish/tests/fixtures'

import { SetupScreen } from '.'

const meta = {
  title: 'App/Setup Screen',
  component: SetupScreen,
  args: {
    bookAvatars: BOOK_AVATARS,
    userAvatars: USER_AVATARS,
    book,
    users,
    accountsWithRelations: getAccountsWithRelations(),
    institutions,
    onUpdateAuthenticatedUser: (firstName: string, lastName: string, avatar?: string) =>
      action('onUpdateAuthenticatedUser')(firstName, lastName, avatar),
    onCreateBook: (
      name: string,
      country: string,
      currency: string,
      logo?: string,
      cloud_book?: any,
    ) => Promise.resolve(action('onCreateBook')(name, country, currency, logo, cloud_book)),
    onCreateEncryptionKey: (seed: string) => action('onCreateEncryptionKey')(seed),
    onDeleteUser: (user) => action('onDeleteUser')(user),
    onSaveUser: (user) => action('onSaveUser')(user),
    onDeleteAccount: (account) => action('onDeleteAccount')(account),
    onDeleteInstitution: (institution) => action('onDeleteInstitution')(institution),
    onSearchInstitutions: searchInstitutions,
    onSaveAccount: (account) => action('onSaveAccount')(account),
    onSaveInstitution: (institution) => action('onSaveInstitution')(institution),
    onComplete: () => action('onComplete')(),
  },
  render: ({ ...args }) => <SetupScreen {...args} />,
} satisfies Meta<typeof SetupScreen>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const NewUser: Story = {
  args: {
    authenticatedUser: {
      id: '1',
      created_on: new Date(),
      modified_on: new Date(),
      email: users[0].email,
      first_name: '',
      last_name: '',
      avatar: undefined,
    },
  },
}

export const ExistingUser: Story = {
  args: {
    authenticatedUser: {
      id: '1',
      created_on: new Date(),
      modified_on: new Date(),
      email: users[0].email,
      first_name: users[0].first_name,
      last_name: users[0].last_name,
      avatar: users[0].avatar,
    },
  },
}
