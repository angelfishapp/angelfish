import { UserTableUIContainer } from '@/components/UserTable'
import { useDeleteUser, useListUsers, useSaveUser } from '@/hooks'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import { USER_AVATARS } from '@angelfish/core'
import type { IAuthenticatedUser } from '@angelfish/core/src/types'

/**
 * Container for UserTableUIContainer
 */
export default function UserTableContainer() {
  // Redux State
  const { users } = useListUsers()

  const userSaveMutation = useSaveUser()
  const userDeleteMutation = useDeleteUser()
  const appState = useGetAppState()
  const authenticatedUser = appState.authenticatedUser as IAuthenticatedUser

  // Render
  return (
    <UserTableUIContainer
      authenticated_user_id={authenticatedUser.id}
      avatars={USER_AVATARS}
      users={users}
      onSave={(user) => {
        userSaveMutation.mutate(user)
      }}
      onDelete={(user) => {
        userDeleteMutation.mutate({ id: user.id })
      }}
    />
  )
}
