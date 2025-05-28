import { useDispatch, useSelector } from 'react-redux'

import { UserTableUIContainer } from '@/components/UserTable'
import { selectAuthenticatedUser } from '@/redux/app/selectors'
import type { IAuthenticatedUser } from '@angelfish/core'
import { USER_AVATARS } from '@angelfish/core'
import { useDeleteUser, useListUsers, useSaveUser } from '@/hooks'

/**
 * Container for UserTableUIContainer
 */
export default function UserTableContainer() {
  // Redux State
  const { users } = useListUsers()

  const userSaveMutation = useSaveUser()
  const userDeleteMutation = useDeleteUser()

  const authenticatedUser = useSelector(selectAuthenticatedUser) as IAuthenticatedUser

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
