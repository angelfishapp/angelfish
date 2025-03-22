import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { initStore } from '../common/actions'
import type { DeleteTagPayload, SaveTagPayload } from './actions'
import { deleteTag, reloadTags, saveTag } from './actions'
import { removeTag, setTag, setTags } from './reducers'

const logger = Logger.scope('TagSagas')

/**
 * Get a list of all the Tags from the Database via IPC
 */
export function* fetchTags(): Generator<any, void, any> {
  try {
    const tags = yield call(CommandsClient.executeAppCommand, AppCommandIds.LIST_TAGS)
    yield put(setTags({ tags }))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save a Tag to the Database
 */
export function* saveTagToDB({
  payload: { tag },
}: PayloadAction<SaveTagPayload>): Generator<any, void, any> {
  try {
    const savedTag = yield call(CommandsClient.executeAppCommand, AppCommandIds.SAVE_TAG, tag)
    yield put(setTag(savedTag))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete a Tag from the Database
 */
export function* deleteTagFromDB({ payload: { id } }: PayloadAction<DeleteTagPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_TAG, { id })
    yield put(removeTag(id))
  } catch (err) {
    logger.error(err)
  }
}

export default function* tagsSagas() {
  yield all([
    takeEvery(initStore, fetchTags),
    takeEvery(reloadTags, fetchTags),
    takeEvery(saveTag, saveTagToDB),
    takeEvery(deleteTag, deleteTagFromDB),
  ])
}
