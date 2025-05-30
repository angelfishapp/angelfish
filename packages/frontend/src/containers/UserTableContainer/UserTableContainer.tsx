import { UserTableUIContainer } from '@/components/UserTable'
import { useDeleteUser, useListUsers, useSaveUser } from '@/hooks'
import { useAppContext } from '@/providers/AppContext'
import { USER_AVATARS } from '@angelfish/core'

/**
 * Container for UserTableUIContainer
 */
export default function UserTableContainer() {
  // Redux State
  const { users } = useListUsers()

  const userSaveMutation = useSaveUser()
  const userDeleteMutation = useDeleteUser()
  const appContext = useAppContext()
  const authenticatedUser = appContext?.authenticatedUser

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
