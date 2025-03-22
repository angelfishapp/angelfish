import type { PayloadAction } from '@reduxjs/toolkit'
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { AppCommandIds, CommandsClient, Logger } from '@angelfish/core'

import { initStore } from '../common/actions'
import type { DeleteCategoryGroupPayload, SaveCategoryGroupPayload } from './actions'
import { deleteCategoryGroup, saveCategoryGroup } from './actions'
import { removeCategoryGroup, setCategoryGroup, setCategoryGroups } from './reducers'

const logger = Logger.scope('CategoryGroupSagas')

/**
 * Get a list of all the Category Groups from the Database via IPC
 */
export function* fetchCategoryGroups(): Generator<any, void, any> {
  try {
    const categoryGroups = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.LIST_CATEGORY_GROUPS,
    )
    yield put(setCategoryGroups({ categoryGroups }))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Save a Category Group to the Database
 */
export function* saveCategoryGroupToDB({
  payload: { categoryGroup },
}: PayloadAction<SaveCategoryGroupPayload>): Generator<any, void, any> {
  try {
    delete categoryGroup.created_on
    delete categoryGroup.modified_on
    const savedCategoryGroup = yield call(
      CommandsClient.executeAppCommand,
      AppCommandIds.SAVE_CATEGORY_GROUP,
      categoryGroup,
    )
    yield put(setCategoryGroup(savedCategoryGroup))
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Delete a Category Group to the Database
 */
export function* deleteCategoryGroupFromDB({
  payload: { categoryGroupId },
}: PayloadAction<DeleteCategoryGroupPayload>) {
  try {
    yield call(CommandsClient.executeAppCommand, AppCommandIds.DELETE_CATEGORY_GROUP, {
      id: categoryGroupId,
    })
    yield put(removeCategoryGroup(categoryGroupId))
  } catch (err) {
    logger.error(err)
  }
}

export default function* categoryGroupSagas() {
  yield all([
    takeEvery(initStore, fetchCategoryGroups),
    takeEvery(saveCategoryGroup, saveCategoryGroupToDB),
    takeEvery(deleteCategoryGroup, deleteCategoryGroupFromDB),
  ])
}
