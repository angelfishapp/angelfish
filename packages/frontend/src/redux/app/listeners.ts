/**
 * Saga Channel to listen to IPC Events sent from Main Process and update Store
 * when new event is received
 */

import { eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'

import { AppEventIds, CommandsClient, Logger } from '@angelfish/core'
import { initStore } from '../common/actions'
import {
  setAuthenticatedUser,
  setBook,
  setFinishSync,
  setIsAuthenticated,
  setStartSync,
  setUserSettings,
} from './reducers'

const logger = Logger.scope('AppListeners')

/**
 * Function to create Redux Saga EventChannel to setup
 * Renderer IPC listeners that trigger when a message
 * is received from the Main process
 */
// eslint-disable-next-line require-yield
function* createIPCChannel() {
  return eventChannel((emit) => {
    // Setup IPC Listeners Here

    // ON_LOGIN
    const onLogin = (payload: any) => {
      emit({
        event: AppEventIds.ON_LOGIN,
        payload,
      })
    }
    const removeOnLogin = CommandsClient.addAppEventListener(AppEventIds.ON_LOGIN, onLogin)

    // ON_LOGOUT
    const onLogout = (payload: any) => {
      emit({
        event: AppEventIds.ON_LOGOUT,
        payload,
      })
    }
    const removeOnLogout = CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, onLogout)

    // ON_BOOK_OPENED
    const onBookOpened = (payload: any) => {
      emit({
        event: AppEventIds.ON_BOOK_OPEN,
        payload,
      })
    }
    const removeOnBookOpened = CommandsClient.addAppEventListener(
      AppEventIds.ON_BOOK_OPEN,
      onBookOpened,
    )

    // ON_BOOK_CLOSED
    const onBookClosed = (payload: any) => {
      emit({
        event: AppEventIds.ON_BOOK_CLOSE,
        payload,
      })
    }
    const removeOnBookClosed = CommandsClient.addAppEventListener(
      AppEventIds.ON_BOOK_CLOSE,
      onBookClosed,
    )

    // ON_SYNC_STARTED
    const onSyncStarted = (payload: any) => {
      emit({
        event: AppEventIds.ON_SYNC_STARTED,
        payload,
      })
    }
    const removeOnSyncStarted = CommandsClient.addAppEventListener(
      AppEventIds.ON_SYNC_STARTED,
      onSyncStarted,
    )

    // ON_SYNC_FINISHED
    const onSyncFinished = (payload: any) => {
      emit({
        event: AppEventIds.ON_SYNC_FINISHED,
        payload,
      })
    }
    const removeOnSyncFinished = CommandsClient.addAppEventListener(
      AppEventIds.ON_SYNC_FINISHED,
      onSyncFinished,
    )

    // ON_UPDATE_AUTHENTICATED_USER
    // const onUpdateAuthenticatedUser = (payload: any) => {
    //   emit({
    //     event: AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
    //     payload,
    //   })
    // }
    // const removeOnUpdateAuthenticatedUser = CommandsClient.addAppEventListener(
    //   AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
    //   onUpdateAuthenticatedUser,
    // )

    // ON_USER_SETTINGS_UPDATED
    const onUpdateUserSettings = (payload: any) => {
      emit({
        event: AppEventIds.ON_USER_SETTINGS_UPDATED,
        payload,
      })
    }
    const removeOnUpdateUserSettings = CommandsClient.addAppEventListener(
      AppEventIds.ON_USER_SETTINGS_UPDATED,
      onUpdateUserSettings,
    )

    return () => {
      // Remove all IPC Listeners
      removeOnLogin()
      removeOnLogout()
      removeOnBookOpened()
      removeOnBookClosed()
      removeOnSyncStarted()
      removeOnSyncFinished()
      // removeOnUpdateAuthenticatedUser()
      removeOnUpdateUserSettings()
    }
  })
}

/**
 * Function to use IPCChannel and listen for messages to update
 * Redux Store
 */
export function* initialiseIPCChannel(): Generator<any, void, any> {
  const channel = yield call(createIPCChannel)
  while (true) {
    const message = yield take(channel)
    switch (message.event) {
      case AppEventIds.ON_LOGIN:
        logger.info('ON_LOGIN', message.payload)
        yield put(setIsAuthenticated({ isAuthenticated: true }))
        yield put(setAuthenticatedUser({ authenticatedUser: message.payload.authenticatedUser }))
        break
      case AppEventIds.ON_LOGOUT:
        logger.info('ON_LOGOUT', message.payload)
        yield put(setIsAuthenticated({ isAuthenticated: false }))
        yield put(setAuthenticatedUser({ authenticatedUser: undefined }))
        break
      case AppEventIds.ON_BOOK_OPEN:
        logger.info('BOOK_OPEN', message.payload)
        yield put(setBook({ book: message.payload.book }))
        break
      case AppEventIds.ON_BOOK_CLOSE:
        logger.info('BOOK_CLOSE', message.payload)
        yield put(setBook({ book: undefined }))
        break
      case AppEventIds.ON_SYNC_STARTED:
        logger.info('SYNC_STARTED', message.payload)
        yield put(setStartSync())
        break
      case AppEventIds.ON_SYNC_FINISHED:
        logger.info('SYNC_FINISHED', message.payload)
        yield put(
          setFinishSync({
            success: message.payload.success,
            duration: message.payload.syncDuration,
            error: message.payload.error,
          }),
        )
        // Reload Store on success
        if (message.payload.success) {
          yield put(initStore({}))
        }
        break
      // case AppEventIds.ON_UPDATE_AUTHENTICATED_USER:
      //   logger.info('ON_UPDATE_AUTHENTICATED_USER', message.payload)
      //   yield put(setAuthenticatedUser({ authenticatedUser: message.payload.authenticatedUser }))
      //   break
      case AppEventIds.ON_USER_SETTINGS_UPDATED:
        logger.info('ON_UPDATE_USER_SETTINGS', message.payload)
        yield put(setUserSettings({ settings: message.payload }))
        break
      default:
        logger.error('Unknown IPC Event: ', message)
    }
  }
}
