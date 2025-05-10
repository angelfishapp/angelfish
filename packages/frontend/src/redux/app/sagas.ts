import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { startIPCChannels } from '../common/actions'
import type { SaveBookPayload } from './actions'
import { getAppState, saveBook } from './actions'
import { initialiseIPCChannel } from './listeners'
import { setAppState, setBook } from './reducers'

const logger = Logger.scope('AppSagas')

/**
 * Set the Book (account for Household/business) from the Database via IPC
 */
export function* fetchBook(): Generator<any, void, any> {
  try {
    const book = yield call(CommandsClient.executeAppCommand, AppCommandIds.GET_BOOK)
    yield put(setBook({ book }))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Get App state from Main process to see if user is authenticated and if book is loaded
 */
export function* fetchAppState(): Generator<any, void, any> {
  try {
    const appState = yield call(CommandsClient.executeAppCommand, AppCommandIds.GET_APP_STATE)
    logger.debug('Fetched App State:', appState)
    yield put(
      setAppState({
        book: appState.book,
        isAuthenticated: appState.authenticated,
        authenticatedUser: appState.authenticatedUser,
        userSettings: appState.userSettings,
      }),
    )
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Update the Existing Book for the current Database
 */
export function* fetchSaveBookToDB({
  payload: { book },
}: PayloadAction<SaveBookPayload>): Generator<any, void, any> {
  try {
    const savedBook = yield call(CommandsClient.executeAppCommand, AppCommandIds.SAVE_BOOK, book)
    yield put(setBook({ book: savedBook }))
  } catch (err) {
    logger.error(err)
  }
}

export default function* appSagas() {
  yield all([
    takeEvery(getAppState, fetchAppState),
    takeEvery(startIPCChannels, initialiseIPCChannel),
    takeEvery(saveBook, fetchSaveBookToDB),
  ])
}
