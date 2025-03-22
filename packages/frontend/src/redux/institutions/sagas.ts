import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { reloadAccounts } from '../accounts/actions'
import { initStore } from '../common/actions'
import type { DeleteInstitutionPayload, SaveInstitutionPayload } from './actions'
import { deleteInstitution, saveInstitution } from './actions'
import { removeInstitution, setInstitution, setInstitutions } from './reducers'

const logger = Logger.scope('InstitutionSagas')

/**
 * Get a list of all the Institutions from the Database via IPC
 */
export function* fetchInstitutions(): Generator<any, void, any> {
  try {
    const institutions = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.LIST_INSTITUTIONS,
    )
    yield put(setInstitutions({ institutions }))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save a Institution to the Database
 */
export function* saveInstitutionToDB({
  payload: { institution },
}: PayloadAction<SaveInstitutionPayload>): Generator<any, void, any> {
  try {
    const savedInstitution = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.SAVE_INSTITUTION,
      institution,
    )
    yield put(setInstitution(savedInstitution))
    yield put(reloadAccounts({}))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete an Institution from the Database
 */
export function* deleteInstitutionFromDB({
  payload: { id },
}: PayloadAction<DeleteInstitutionPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_INSTITUTION, { id })
    yield put(removeInstitution(id))
    yield put(reloadAccounts({}))
  } catch (err) {
    logger.error(err)
  }
}

export default function* institutionsSagas() {
  yield all([
    takeEvery(initStore, fetchInstitutions),
    takeEvery(saveInstitution, saveInstitutionToDB),
    takeEvery(deleteInstitution, deleteInstitutionFromDB),
  ])
}
