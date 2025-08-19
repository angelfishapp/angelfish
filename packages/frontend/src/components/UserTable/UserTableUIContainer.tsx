import DialogContentText from '@mui/material/DialogContentText'
import React from 'react'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { UserDrawer } from '@/components/drawers/UserDrawer'
import { useTranslate } from '@/utils/i18n'
import type { IUser } from '@angelfish/core'
import UserTable from './UserTable'
import type { UserTableUIContainerProps } from './UserTableUIContainer.interface'

/**
 * Book Members Table. Lists users and allows user to manage and edit them.
 *
 * Contains UserDrawer and ConfirmDialog components which are opened when a user edits, creates
 * or deletes a user.
 */
export default function UserTableUIContainer({
  avatars,
  authenticated_user_id,
  users,
  onSave,
  onDelete,
}: UserTableUIContainerProps) {
  const { UserTable: t } = useTranslate('components')

  // Component State
  const [selectedUser, setSelectedUser] = React.useState<IUser | undefined>(undefined)
  const [showUserDrawer, setShowUserDrawer] = React.useState<boolean>(false)
  const [showUserDeleteModal, setShowUserDeleteModal] = React.useState<boolean>(false)

  // Render
  return (
    <React.Fragment>
      <UserTable
        users={users}
        authenticated_user_id={authenticated_user_id}
        onEdit={(user) => {
          setSelectedUser(user)
          setShowUserDrawer(true)
        }}
        onDelete={(user) => {
          setSelectedUser(user)
          setShowUserDeleteModal(true)
        }}
        onCreate={() => {
          setSelectedUser(undefined)
          setShowUserDrawer(true)
        }}
      />
      <UserDrawer
        initialValue={selectedUser}
        avatars={avatars}
        onSave={onSave}
        onClose={() => setShowUserDrawer(false)}
        open={showUserDrawer}
      />
      <ConfirmDialog
        title={t['Delete User']}
        confirmText={t['Delete User']}
        onConfirm={() => {
          onDelete(selectedUser as IUser)
          setShowUserDeleteModal(false)
          setSelectedUser(undefined)
        }}
        onClose={() => setShowUserDeleteModal(false)}
        open={showUserDeleteModal}
      >
        <DialogContentText>
          {t['Are you sure you want to delete the user']}{' '}
          <em>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </em>{' '}
          {t['from Angelfish?']}
        </DialogContentText>
      </ConfirmDialog>
    </React.Fragment>
  )
}
