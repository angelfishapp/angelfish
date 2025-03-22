import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SetupScreen } from '@/app/components/SetupScreen'
import { deleteAccount, saveAccount } from '@/redux/accounts/actions'
import { selectAllAccountsWithRelations } from '@/redux/accounts/selectors'
import { selectAuthenticatedUser, selectBook } from '@/redux/app/selectors'
import { deleteInstitution, saveInstitution } from '@/redux/institutions/actions'
import { selectAllInstitutions } from '@/redux/institutions/selectors'
import { deleteUser, saveUser, updateAuthenticatedUser } from '@/redux/users/actions'
import { selectAllUsers } from '@/redux/users/selectors'
import { BOOK_AVATARS, USER_AVATARS } from '@angelfish/core'
import type { SetupScreenContainerProps } from './SetupScreenContainer.interface'

/**
 * Container for Setup Screen to handle all logic and data fetching
 */
export default function SetupScreenContainer({ onComplete }: SetupScreenContainerProps) {
  // Redux Hooks
  const dispatch = useDispatch()
  const authenticatedUser = useSelector(selectAuthenticatedUser)
  const users = useSelector(selectAllUsers)
  const accountsWithRelations = useSelector(selectAllAccountsWithRelations)
  const institutions = useSelector(selectAllInstitutions)
  const book = useSelector(selectBook)

  /**
   * Callback to search available Institutions via API/Database
   */
  const onSearchInstitutions = React.useCallback(async (query: string) => {
    return await window.api.search_institutions({ query })
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
      const filePath = await window.electron.openSaveDialog({
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
        await window.api.create_new_file({
          name,
          country,
          default_currency: currency,
          filePath,
          logo,
          entity: 'HOUSEHOLD',
        })
      } else {
        throw new Error('No File Path Selected')
      }
    },
    [],
  )

  /**
   * Callback to update user profile during Setup
   */
  const onUpdateAuthenticatedUser = React.useCallback(
    (firstName: string, lastName: string, avatar?: string) => {
      dispatch(
        updateAuthenticatedUser({
          user: {
            id: authenticatedUser?.id as string,
            first_name: firstName,
            last_name: lastName,
            email: authenticatedUser?.email as string,
            avatar,
          },
        }),
      )
    },
    [dispatch, authenticatedUser?.email, authenticatedUser?.id],
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
      onDeleteUser={(user) => dispatch(deleteUser({ userId: user.id }))}
      onSaveUser={(user) => dispatch(saveUser({ user }))}
      onSaveAccount={(account) => dispatch(saveAccount({ account }))}
      onDeleteAccount={(account) => dispatch(deleteAccount({ id: account.id }))}
      onSaveInstitution={(institution) => dispatch(saveInstitution({ institution }))}
      onDeleteInstitution={(institution) => dispatch(deleteInstitution({ id: institution.id }))}
      onSearchInstitutions={onSearchInstitutions}
      onComplete={onComplete}
    />
  )
}
