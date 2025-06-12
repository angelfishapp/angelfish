import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { IUserSettings } from '@angelfish/core'
import { AppEventIds, AppProcessIDs, CommandsClient, Logger } from '@angelfish/core'
import type { IFrontEndAppState } from './FrontEndAppState.interface'
import { DEFAULT_APP_STATE } from './useGetAppState'

const logger = Logger.scope('useHandleAppState')

/**
 * Hook to handle App state changes by listening to App events
 * and updating the React Query cache accordingly.
 */
export function useHandleAppState() {
  const queryClient = useQueryClient()

  React.useEffect(() => {
    let removeOnLogin: () => void
    let removeOnLogout: () => void
    let removeOnBookOpen: () => void
    let removeOnBookClose: () => void
    let removeOnSyncStarted: () => void
    let removeOnSyncFinished: () => void
    let removeOnUpdateAuthenticatedUser: () => void
    let removeOnUserSettingsUpdated: () => void

    // Ensure CommandsClient is ready before setting up listeners
    CommandsClient.isReady([AppProcessIDs.MAIN, AppProcessIDs.WORKER]).then(() => {
      let bookOpen = false

      // ON_LOGIN
      removeOnLogin = CommandsClient.addAppEventListener(AppEventIds.ON_LOGIN, (payload) => {
        logger.debug('ON_LOGIN', payload)
        queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
          if (!prevState) {
            return {
              ...DEFAULT_APP_STATE,
              authenticated: true,
              authenticatedUser: payload?.authenticatedUser,
            }
          }
          return {
            ...prevState,
            authenticated: true,
            authenticatedUser: payload?.authenticatedUser,
          }
        })
      })

      // ON_LOGOUT
      removeOnLogout = CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, (payload) => {
        logger.debug('ON_LOGOUT', payload)
        queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
          if (!prevState) {
            return DEFAULT_APP_STATE
          }
          return {
            ...prevState,
            authenticated: false,
            authenticatedUser: undefined,
          }
        })
      })

      // ON_BOOK_OPEN
      removeOnBookOpen = CommandsClient.addAppEventListener(AppEventIds.ON_BOOK_OPEN, (payload) => {
        logger.debug('ON_BOOK_OPEN', payload)
        bookOpen = true
        queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
          if (!prevState) {
            return {
              ...DEFAULT_APP_STATE,
              book: payload?.book,
            }
          }
          return {
            ...prevState,
            book: payload?.book,
          }
        })
      })

      // ON_BOOK_CLOSE
      removeOnBookClose = CommandsClient.addAppEventListener(
        AppEventIds.ON_BOOK_CLOSE,
        (payload) => {
          logger.debug('ON_BOOK_CLOSE', payload)
          bookOpen = false
          queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
            if (!prevState) {
              return DEFAULT_APP_STATE
            }
            return {
              ...prevState,
              book: undefined,
              bookFilePath: undefined,
            }
          })
        },
      )

      // ON_SYNC_STARTED
      removeOnSyncStarted = CommandsClient.addAppEventListener(AppEventIds.ON_SYNC_STARTED, () => {
        logger.debug('ON_SYNC_STARTED')
        queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
          if (!prevState) {
            return {
              ...DEFAULT_APP_STATE,
              syncInfo: {
                isSyncing: true,
                startTime: Date.now(),
                finishTime: undefined,
                success: false,
                durationMs: 0,
                error: undefined,
              },
            }
          }
          return {
            ...prevState,
            syncInfo: {
              isSyncing: true,
              startTime: Date.now(),
              finishTime: undefined,
              success: false,
              durationMs: 0,
              error: undefined,
            },
          }
        })
      })

      // ON_SYNC_FINISHED
      removeOnSyncFinished = CommandsClient.addAppEventListener(
        AppEventIds.ON_SYNC_FINISHED,
        (payload) => {
          logger.debug('ON_SYNC_FINISHED', payload)
          queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
            if (!prevState) {
              return DEFAULT_APP_STATE
            }
            return {
              ...prevState,
              syncInfo: {
                isSyncing: false,
                startTime: prevState.syncInfo.startTime,
                finishTime: Date.now(),
                success: payload?.completed ?? false,
                durationMs: prevState.syncInfo.startTime
                  ? Date.now() - prevState.syncInfo.startTime
                  : 0,
                error: payload?.errorMessage,
              },
            }
          })

          // Reload Store on success
          if (payload?.completed) {
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.ACCOUNTS })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.BOOK })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.CATEGORY_GROUPS })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.INSTITUTIONS })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.TAGS })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.TRANSACTIONS })
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.USERS })
          }
        },
      )

      // ON_UPDATE_AUTHENTICATED_USER
      removeOnUpdateAuthenticatedUser = CommandsClient.addAppEventListener(
        AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
        (payload) => {
          logger.debug('ON_UPDATE_AUTHENTICATED_USER', payload)
          queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
            if (!prevState) {
              return {
                ...DEFAULT_APP_STATE,
                authenticated: true,
                authenticatedUser: payload,
              }
            }
            return {
              ...prevState,
              authenticated: true,
              authenticatedUser: payload,
            }
          })

          // If book is open, we might want to refresh the book data
          if (bookOpen) {
            queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.USERS })
          }
        },
      )

      // ON_USER_SETTINGS_UPDATED
      removeOnUserSettingsUpdated = CommandsClient.addAppEventListener(
        AppEventIds.ON_USER_SETTINGS_UPDATED,
        (payload) => {
          logger.debug('ON_USER_SETTINGS_UPDATED', payload)
          queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
            if (!prevState) {
              return {
                ...DEFAULT_APP_STATE,
                userSettings: payload as IUserSettings,
              }
            }
            return {
              ...prevState,
              userSettings: payload as IUserSettings,
            }
          })
        },
      )
    })

    // Cleanup function to remove all listeners
    return () => {
      if (removeOnLogin) removeOnLogin()
      if (removeOnLogout) removeOnLogout()
      if (removeOnBookOpen) removeOnBookOpen()
      if (removeOnBookClose) removeOnBookClose()
      if (removeOnSyncStarted) removeOnSyncStarted()
      if (removeOnSyncFinished) removeOnSyncFinished()
      if (removeOnUpdateAuthenticatedUser) removeOnUpdateAuthenticatedUser()
      if (removeOnUserSettingsUpdated) removeOnUserSettingsUpdated()
    }
  }, [queryClient])
}
