import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { initStore } from '../common/actions'
import type { DeleteAccountPayload, SaveAccountPayload } from './actions'
import { deleteAccount, reloadAccounts, saveAccount } from './actions'
import { removeAccount, setAccount, setAccounts } from './reducers'

const logger = Logger.scope('AccountsSagas')

/**
 * Get a list of all the Accounts in the Database via IPC
 */
export function* fetchAccounts(): Generator<any, void, any> {
  try {
    const accounts = yield call(CommandsClient.executeAppCommand, AppCommandIds.LIST_ACCOUNTS)
    yield put(setAccounts(accounts))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save a Account to the Database
 */
export function* saveAccountToDB({
  payload: { account },
}: PayloadAction<SaveAccountPayload>): Generator<any, void, any> {
  try {
    delete account.created_on
    delete account.modified_on
    const savedAccount = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.SAVE_ACCOUNT,
      account,
    )
    yield put(setAccount(savedAccount))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete a Account from the Database
 */
export function* deleteAccountFromDB({
  payload: { id, reassignId },
}: PayloadAction<DeleteAccountPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_ACCOUNT, { id, reassignId })
    yield put(removeAccount(id))
  } catch (err) {
    logger.error(err)
  }
}

export default function* accountsSagas() {
  yield all([
    takeEvery(initStore, fetchAccounts),
    takeEvery(saveAccount, saveAccountToDB),
    takeEvery(deleteAccount, deleteAccountFromDB),
    takeEvery(reloadAccounts, fetchAccounts),
  ])
}
