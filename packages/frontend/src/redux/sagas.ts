/**
 * Combine all Slice Sagas into the RootSaga Here
 */

import { all, fork } from 'redux-saga/effects'

import accountsSagas from './accounts/sagas'
import appSagas from './app/sagas'
import categoryGroupSagas from './categoryGroups/sagas'
import institutionsSagas from './institutions/sagas'
import tagsSagas from './tags/sagas'
import transactionSagas from './transactions/sagas'
import userSagas from './users/sagas'

export default function* rootSaga() {
  yield all([
    fork(appSagas),
    fork(userSagas),
    fork(categoryGroupSagas),
    fork(accountsSagas),
    fork(institutionsSagas),
    fork(transactionSagas),
    fork(tagsSagas),
  ])
}
