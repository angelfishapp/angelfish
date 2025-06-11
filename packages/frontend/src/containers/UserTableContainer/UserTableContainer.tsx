import { UserTableUIContainer } from '@/components/UserTable'
import { useDeleteUser, useGetAuthenticatedUser, useListUsers, useSaveUser } from '@/hooks'
import { USER_AVATARS } from '@angelfish/core'
import type { IAuthenticatedUser } from '@angelfish/core/src/types'

/**
 * Container for UserTableUIContainer
 */
export default function UserTableContainer() {
  // React-Query State
  const { users } = useListUsers()
  const { authenticatedUser } = useGetAuthenticatedUser()
  const userSaveMutation = useSaveUser()
  const userDeleteMutation = useDeleteUser()

  // Render
  return (
    <UserTableUIContainer
      authenticated_user_id={(authenticatedUser as IAuthenticatedUser).id}
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
