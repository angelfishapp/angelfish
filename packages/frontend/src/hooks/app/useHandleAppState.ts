import { queryClient } from '@/providers'
import { AppEventIds, CommandsClient, Logger } from '@angelfish/core'

const logger = Logger.scope('AppListeners')

export function setupIPCListeners() {
  const handleMessage = (event: string, payload: any) => {
    switch (event) {
      case AppEventIds.ON_LOGIN:
        logger.debug('ON_LOGIN', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_LOGOUT:
        logger.debug('ON_LOGOUT', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_BOOK_OPEN:
        logger.debug('ON_BOOK_OPEN', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_BOOK_CLOSE:
        logger.debug('ON_BOOK_CLOSE', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_SYNC_STARTED:
        logger.debug('ON_SYNC_STARTED', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_SYNC_FINISHED:
        logger.debug('ON_SYNC_FINISHED', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_UPDATE_AUTHENTICATED_USER:
        logger.debug('ON_UPDATE_AUTHENTICATED_USER', payload)
        queryClient.invalidateQueries({ queryKey: ['appState'] })
        break
      case AppEventIds.ON_USER_SETTINGS_UPDATED:
        logger.debug('ON_USER_SETTINGS_UPDATED', payload)
        queryClient.invalidateQueries({ queryKey: ['appState', 'users'] })
        break
      default:
        logger.error('Unknown event:', event, payload)
    }
  }

  // Register IPC listeners
  CommandsClient.addAppEventListener(AppEventIds.ON_LOGIN, (payload) =>
    handleMessage(AppEventIds.ON_LOGIN, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, (payload) =>
    handleMessage(AppEventIds.ON_LOGOUT, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_BOOK_OPEN, (payload) =>
    handleMessage(AppEventIds.ON_BOOK_OPEN, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_BOOK_CLOSE, (payload) =>
    handleMessage(AppEventIds.ON_BOOK_CLOSE, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_SYNC_STARTED, (payload) =>
    handleMessage(AppEventIds.ON_SYNC_STARTED, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_SYNC_FINISHED, (payload) =>
    handleMessage(AppEventIds.ON_SYNC_FINISHED, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_UPDATE_AUTHENTICATED_USER, (payload) =>
    handleMessage(AppEventIds.ON_UPDATE_AUTHENTICATED_USER, payload),
  )
  CommandsClient.addAppEventListener(AppEventIds.ON_USER_SETTINGS_UPDATED, (payload) =>
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
