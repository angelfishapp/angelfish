/**
 * Saga Channel to listen to IPC Events sent from Main Process and update Store
 * when new event is received
 */

import { getAppContextRef } from '@/providers/AppContextRef'
import { AppEventIds, CommandsClient, Logger } from '@angelfish/core'

const logger = Logger.scope('AppListeners')

/**
 * Function to create Redux Saga EventChannel to setup
 * Renderer IPC listeners that trigger when a message
 * is received from the Main process
 */
// eslint-disable-next-line require-yield
export function* StartIPCChannel() {
  console.log('StartIPCChannel called')
  // set context

  // ON_LOGIN
  const onLogin = (payload: any) => {
    // set data on contex

    listennerForUpdate({
      event: AppEventIds.ON_LOGIN,
      payload,
    })
  }
  const removeOnLogin = CommandsClient.addAppEventListener(AppEventIds.ON_LOGIN, onLogin)

  // ON_LOGOUT
  const onLogout = (payload: any) => {
    listennerForUpdate({
      event: AppEventIds.ON_LOGOUT,
      payload,
    })
  }
  const removeOnLogout = CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, onLogout)

  // ON_BOOK_OPENED
  const onBookOpened = (payload: any) => {
    listennerForUpdate({
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
    listennerForUpdate({
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
    listennerForUpdate({
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
    listennerForUpdate({
      event: AppEventIds.ON_SYNC_FINISHED,
      payload,
    })
  }
  const removeOnSyncFinished = CommandsClient.addAppEventListener(
    AppEventIds.ON_SYNC_FINISHED,
    onSyncFinished,
  )

  // ON_UPDATE_AUTHENTICATED_USER
  const onUpdateAuthenticatedUser = (payload: any) => {
    listennerForUpdate({
      event: AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
      payload,
    })
  }
  const removeOnUpdateAuthenticatedUser = CommandsClient.addAppEventListener(
    AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
    onUpdateAuthenticatedUser,
  )

  // ON_USER_SETTINGS_UPDATED
  const onUpdateUserSettings = (payload: any) => {
    listennerForUpdate({
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
    removeOnUpdateAuthenticatedUser()
    removeOnUpdateUserSettings()
  }
}

/**
 * Function to use IPCChannel and listen for messages to update
 * Redux Store
 */
export function listennerForUpdate(message: any) {
  let bookOpen = false
  const context = getAppContextRef()

  switch (message.event) {
    case AppEventIds.ON_LOGIN:
      logger.debug('ON_LOGIN', message.payload)
      context.setIsAuthenticated(true)
      context.setAuthenticatedUser(message.payload.authenticatedUser)

      break
    case AppEventIds.ON_LOGOUT:
      logger.debug('ON_LOGOUT', message.payload)
      context.setIsAuthenticated(false)
      context.setAuthenticatedUser(null)

      break
    case AppEventIds.ON_BOOK_OPEN:
      logger.debug('BOOK_OPEN', message.payload)
      bookOpen = true
      context.setBook(message.payload.book)
      break
    case AppEventIds.ON_BOOK_CLOSE:
      logger.debug('BOOK_CLOSE', message.payload)
      bookOpen = false
      context.setBook(null)
      break
    case AppEventIds.ON_SYNC_STARTED:
      logger.debug('SYNC_STARTED', message.payload)
      context.setSyncStatus('started')
      break
    case AppEventIds.ON_SYNC_FINISHED:
      logger.debug('SYNC_FINISHED', message.payload)
      context.setSyncStatus(message.payload.success ? 'finished' : 'error')
      // Reload Store on success
      if (message.payload.success) {
        // yield put(initStore({}))
      }
      break
    case AppEventIds.ON_UPDATE_AUTHENTICATED_USER:
      logger.debug('ON_UPDATE_AUTHENTICATED_USER', message.payload)
      context.setAuthenticatedUser(message.payload)
      // if (bookOpen) {
      //   yield put(reloadUsers({}))
      // }
      break
    case AppEventIds.ON_USER_SETTINGS_UPDATED:
      logger.debug('ON_UPDATE_USER_SETTINGS', message.payload)
      context.setUserSettings(message.payload)
      break
    default:
      logger.error('Unknown IPC Event: ', message)
  }
}
