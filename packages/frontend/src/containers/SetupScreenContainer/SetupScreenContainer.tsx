import React from 'react'

import { SetupScreen } from '@/app/components/SetupScreen'
import {
  useDeleteAccount,
  useDeleteInstitution,
  useDeleteUser,
  useGetBook,
  useListAllAccountsWithRelations,
  useListInstitutions,
  useListUsers,
  useSaveAccount,
  useSaveInstitution,
  useSaveUser,
  useUpdateUser,
} from '@/hooks'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import { AppCommandIds, BOOK_AVATARS, CommandsClient, USER_AVATARS } from '@angelfish/core'
import type { SetupScreenContainerProps } from './SetupScreenContainer.interface'

/**
 * Container for Setup Screen to handle all logic and data fetching
 */
export default function SetupScreenContainer({ onComplete, onStart }: SetupScreenContainerProps) {
  // Redux Hooks
  const { authenticatedUser } = useGetAppState()
  const { users } = useListUsers()
  const { accounts: accountsWithRelations } = useListAllAccountsWithRelations()
  const { institutions } = useListInstitutions()
  const { book } = useGetBook()

  const userSaveMutation = useSaveUser()
  const userDeleteMutation = useDeleteUser()
  const userUpdateMutation = useUpdateUser()
  const accountSaveMutation = useSaveAccount()
  const accountDeleteMutation = useDeleteAccount()
  const institutionSaveMutation = useSaveInstitution()
  const institutionDeleteMutation = useDeleteInstitution()

  /**
   * Callback to search available Institutions via API/Database
   */
  const onSearchInstitutions = React.useCallback(async (query: string) => {
    return await CommandsClient.executeAppCommand(AppCommandIds.SEARCH_INSTITUTIONS, { query })
  }, [])

  /**
   * Create a new local Database with remote Cloud Account. Will return Book if successful
   * or undefined if didn't complete. Will open 'Save As' native dialog in Electron
   *
   * @param name        The Book's name
   * @param country     The ISO-3166-1 alpha-2 country code the Book is located in
   * @param currency    The default currency for Book in ISO 4217 currency code format
   * @param logo        Base64 Encoded PNG logo for Book
   * @param cloud_book  Cloud Book to Link To, if set will link Book to existing Cloud Account
   */
  const onCreateBook = React.useCallback(
    async (name: string, country: string, currency: string, logo?: string) => {
      // Open Save Dialog to select file location
      const filePath = await CommandsClient.executeAppCommand(AppCommandIds.SHOW_SAVE_FILE_DIALOG, {
        title: 'Select File Location...',
        defaultPath: `${name}.afish`,
        filters: [
          {
            name: 'Angelfish File',
            extensions: ['afish'],
          },
        ],
      })

      // If filePath selected, create book file
      if (filePath) {
        onStart()
        await CommandsClient.executeAppCommand(AppCommandIds.CREATE_BOOK, {
          filePath,
          book: {
            name,
            country,
            default_currency: currency,
            logo,
            entity: 'HOUSEHOLD',
          },
        })
      } else {
        throw new Error('No File Path Selected')
      }
    },
    [onStart],
  )

  /**
   * Callback to update user profile during Setup
   */
  const onUpdateAuthenticatedUser = React.useCallback(
    (firstName: string, lastName: string, avatar?: string) => {
      userUpdateMutation.mutate({
        first_name: firstName,
        last_name: lastName,
        avatar,
      })
    },
    [userUpdateMutation],
  )

  // Render
  if (!authenticatedUser) {
    return null
  }

  return (
    <SetupScreen
      authenticatedUser={authenticatedUser}
      bookAvatars={BOOK_AVATARS}
      userAvatars={USER_AVATARS}
      users={users}
      accountsWithRelations={accountsWithRelations}
      book={book}
      institutions={institutions}
      onUpdateAuthenticatedUser={onUpdateAuthenticatedUser}
      onCreateBook={onCreateBook}
      onCreateEncryptionKey={(_seed) => {
        /* TODO */
      }}
      onDeleteUser={(user) => userDeleteMutation.mutate({ id: user.id })}
      onSaveUser={(user) => userSaveMutation.mutate(user)}
      onSaveAccount={(account) => accountSaveMutation.mutate(account)}
      onDeleteAccount={(account) =>
        accountDeleteMutation.mutate({ id: account.id, reassignId: null })
      }
      onSaveInstitution={(institution) => institutionSaveMutation.mutate(institution)}
      onDeleteInstitution={(institution) =>
        institutionDeleteMutation.mutate({ id: institution.id })
      }
      onSearchInstitutions={onSearchInstitutions}
      onComplete={onComplete}
    />
  )
}
