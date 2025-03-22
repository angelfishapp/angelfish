import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import type { AppCommandRequest } from '@angelfish/core'
import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { reloadAccounts } from '../accounts/actions'
import { reloadTags } from '../tags/actions'
import type { DeleteTransactionPayload, SaveTransactionsPayload } from './actions'
import { deleteTransaction, listTransactions, saveTransactions } from './actions'
import { removeTransaction, setQuery, setTransactions, updateTransactions } from './reducers'

const logger = Logger.scope('TransactionSagas')

/**
 * Get a list of all the Category Groups from the Database via IPC
 */
export function* fetchTransactions({
  payload: query,
}: PayloadAction<AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>>): Generator<any, void, any> {
  try {
    const transactions = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.LIST_TRANSACTIONS,
      query,
    )
    yield put(setQuery(query))
    yield put(setTransactions({ transactions }))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save an Array of Transactions to the Database & Store. Will update existing Transactions if already exist
 */
export function* saveTransactionsToDB({
  payload: { transactions },
}: PayloadAction<SaveTransactionsPayload>): Generator<any, void, any> {
  // Check if any new Tag(s) have been added
  let hasNewTags = false
  for (const transaction of transactions) {
    if (hasNewTags) {
      break
    }
    for (const line_item of transaction.line_items) {
      if (hasNewTags) {
        break
      }
      if (line_item.tags) {
        for (const tag of line_item.tags) {
          if (!tag.id) {
            hasNewTags = true
            break
          }
        }
      }
    }
  }

  try {
    const savedTransactions = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.SAVE_TRANSACTIONS,
      transactions,
    )
    // Update/Add Transactions to Store
    yield put(updateTransactions(savedTransactions))

    // Update Tags if hasNewTags == true
    if (hasNewTags) {
      yield put(reloadTags({}))
    }

    // Update Account Balances
    yield put(reloadAccounts({}))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete a Transaction from the Database & Store
 */
export function* deleteTransactionFromDB({
  payload: { id },
}: PayloadAction<DeleteTransactionPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_TRANSACTION, { id })

    // Remove Transaction from Store
    yield put(removeTransaction(id))

    // Update Account Balances
    yield put(reloadAccounts({}))
  } catch (err) {
    logger.error(err)
  }
}

export default function* transactionSagas() {
  yield all([
    takeEvery(listTransactions, fetchTransactions),
    takeEvery(saveTransactions, saveTransactionsToDB),
    takeEvery(deleteTransaction, deleteTransactionFromDB),
  ])
}
