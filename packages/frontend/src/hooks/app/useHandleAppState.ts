import { getAppContextRef } from '@/providers/AppContextRef'
import { AppEventIds, Logger } from '@angelfish/core'

const logger = Logger.scope('AppListeners')

export function setupIPCListeners() {
  const context = getAppContextRef()

  const handleMessage = (event: string, payload: any) => {
    switch (event) {
      case AppEventIds.ON_LOGIN:
        logger.debug('ON_LOGIN', payload)
        context.setIsAuthenticated(true)
        context.setAuthenticatedUser(payload.authenticatedUser)
        break
      case AppEventIds.ON_LOGOUT:
        logger.debug('ON_LOGOUT', payload)
        context.setIsAuthenticated(false)
        context.setAuthenticatedUser(null)
        break
      case AppEventIds.ON_BOOK_OPEN:
        logger.debug('ON_BOOK_OPEN', payload)
        context.setBook(payload.book)
        break
      case AppEventIds.ON_BOOK_CLOSE:
        logger.debug('ON_BOOK_CLOSE', payload)
        context.setBook(null)
        break
      case AppEventIds.ON_SYNC_STARTED:
        logger.debug('ON_SYNC_STARTED', payload)
        context.setSyncStatus('started')
        break
      case AppEventIds.ON_SYNC_FINISHED:
        logger.debug('ON_SYNC_FINISHED', payload)
        context.setSyncStatus(payload.success ? 'finished' : 'error')
        break
      case AppEventIds.ON_UPDATE_AUTHENTICATED_USER:
        logger.debug('ON_UPDATE_AUTHENTICATED_USER', payload)
        context.setAuthenticatedUser(payload)
        break
      case AppEventIds.ON_USER_SETTINGS_UPDATED:
        logger.debug('ON_USER_SETTINGS_UPDATED', payload)
        context.setUserSettings(payload)
        break
      default:
        logger.error('Unknown event:', event, payload)
    }
  }

  // Register IPC listeners
  window?.electron?.ipc.on(AppEventIds.ON_LOGIN, (payload) =>
    handleMessage(AppEventIds.ON_LOGIN, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_LOGOUT, (payload) =>
    handleMessage(AppEventIds.ON_LOGOUT, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_BOOK_OPEN, (payload) =>
    handleMessage(AppEventIds.ON_BOOK_OPEN, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_BOOK_CLOSE, (payload) =>
    handleMessage(AppEventIds.ON_BOOK_CLOSE, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_SYNC_STARTED, (payload) =>
    handleMessage(AppEventIds.ON_SYNC_STARTED, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_SYNC_FINISHED, (payload) =>
    handleMessage(AppEventIds.ON_SYNC_FINISHED, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_UPDATE_AUTHENTICATED_USER, (payload) =>
    handleMessage(AppEventIds.ON_UPDATE_AUTHENTICATED_USER, payload),
  )
  window?.electron?.ipc.on(AppEventIds.ON_USER_SETTINGS_UPDATED, (payload) =>
    handleMessage(AppEventIds.ON_USER_SETTINGS_UPDATED, payload),
  )

  // Optionally return a function to remove all listeners
  return () => {
    const ipc = window?.electron?.ipc
    ipc.removeAllListeners(AppEventIds.ON_LOGIN)
    ipc.removeAllListeners(AppEventIds.ON_LOGOUT)
    ipc.removeAllListeners(AppEventIds.ON_BOOK_OPEN)
    ipc.removeAllListeners(AppEventIds.ON_BOOK_CLOSE)
    ipc.removeAllListeners(AppEventIds.ON_SYNC_STARTED)
    ipc.removeAllListeners(AppEventIds.ON_SYNC_FINISHED)
    ipc.removeAllListeners(AppEventIds.ON_UPDATE_AUTHENTICATED_USER)
    ipc.removeAllListeners(AppEventIds.ON_USER_SETTINGS_UPDATED)
  }
}
