import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { initStore } from '../common/actions'
import type { DeleteUserPayload, SaveUserPayload, UpdateAuthenticatedUserPayload } from './actions'
import { deleteUser, reloadUsers, saveUser, updateAuthenticatedUser } from './actions'
import { removeUser, setUser, setUsers } from './reducers'

const logger = Logger.scope('UserSagas')

/**
 * Get a list of all the Users from the Database via IPC
 */
export function* fetchUsers(): Generator<any, void, any> {
  try {
    const users = yield call(CommandsClient.executeAppCommand, AppCommandIds.LIST_USERS)
    yield put(setUsers(users))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save a User to the Database
 */
export function* saveUserToDB({
  payload: { user },
}: PayloadAction<SaveUserPayload>): Generator<any, void, any> {
  try {
    const savedUser = yield call(CommandsClient.executeAppCommand, AppCommandIds.SAVE_USER, user)

    // If user has Id, then it's from database and should be added to store
    if (savedUser?.id) {
      yield put(setUser(savedUser))
    }
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Update the currently authenticated user
 */
export function* updateAuthenticatedUserCall({
  payload: { user },
}: PayloadAction<UpdateAuthenticatedUserPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.UPDATE_AUTHENTICATED_USER, user)
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete a User from the Database
 */
export function* deleteUserFromDB({ payload: { userId } }: PayloadAction<DeleteUserPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_USER, { id: userId })
    yield put(removeUser(userId))
  } catch (err) {
    logger.error(err)
  }
}

export default function* userSaga() {
  yield all([
    takeEvery(initStore, fetchUsers),
    takeEvery(reloadUsers, fetchUsers),
    takeEvery(saveUser, saveUserToDB),
    takeEvery(updateAuthenticatedUser, updateAuthenticatedUserCall),
    takeEvery(deleteUser, deleteUserFromDB),
  ])
}
