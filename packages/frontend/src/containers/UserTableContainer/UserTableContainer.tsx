import { useDispatch, useSelector } from 'react-redux'

import { UserTableUIContainer } from '@/components/UserTable'
import { selectAuthenticatedUser } from '@/redux/app/selectors'
import { deleteUser, saveUser } from '@/redux/users/actions'
import { selectAllUsers } from '@/redux/users/selectors'
import type { IAuthenticatedUser } from '@angelfish/core'
import { USER_AVATARS } from '@angelfish/core'

/**
 * Container for UserTableUIContainer
 */
export default function UserTableContainer() {
  // Redux State
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const authenticatedUser = useSelector(selectAuthenticatedUser) as IAuthenticatedUser

  // Render
  return (
    <UserTableUIContainer
      authenticated_user_id={authenticatedUser.id}
      avatars={USER_AVATARS}
      users={users}
      onSave={(user) => {
        dispatch(saveUser({ user }))
      }}
      onDelete={(user) => {
        dispatch(deleteUser({ userId: user.id }))
      }}
    />
  )
}
