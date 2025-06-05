import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { AppEventIds, AppProcessIDs, CommandsClient, Logger } from '@angelfish/core'
import type { IFrontEndAppState } from './FrontEndAppState.interface'

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
        queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
          ...prevState,
          isAuthenticated: true,
          authenticatedUser: payload?.authenticatedUser,
        }))
      })

      // ON_LOGOUT
      removeOnLogout = CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, (payload) => {
        logger.debug('ON_LOGOUT', payload)
        queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
          ...prevState,
          isAuthenticated: false,
          authenticatedUser: undefined,
        }))
      })

      // ON_BOOK_OPEN
      removeOnBookOpen = CommandsClient.addAppEventListener(AppEventIds.ON_BOOK_OPEN, (payload) => {
        logger.debug('ON_BOOK_OPEN', payload)
        bookOpen = true
        queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
          ...prevState,
          book: payload?.book,
        }))
      })

      // ON_BOOK_CLOSE
      removeOnBookClose = CommandsClient.addAppEventListener(
        AppEventIds.ON_BOOK_CLOSE,
        (payload) => {
          logger.debug('ON_BOOK_CLOSE', payload)
          bookOpen = false
          queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
            ...prevState,
            book: undefined,
          }))
        },
      )

      // ON_SYNC_STARTED
      removeOnSyncStarted = CommandsClient.addAppEventListener(AppEventIds.ON_SYNC_STARTED, () => {
        logger.debug('ON_SYNC_STARTED')
        queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
          ...prevState,
          syncInfo: {
            isSyncing: true,
            startTime: Date.now(),
            finishTime: undefined,
            success: false,
            durationMs: 0,
            error: undefined,
          },
        }))
      })

      // ON_SYNC_FINISHED
      removeOnSyncFinished = CommandsClient.addAppEventListener(
        AppEventIds.ON_SYNC_FINISHED,
        (payload) => {
          logger.debug('ON_SYNC_FINISHED', payload)
          queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
            ...prevState,
            syncInfo: {
              isSyncing: false,
              startTime: prevState.syncInfo.startTime,
              finishTime: Date.now(),
              success: payload?.completed,
              durationMs: prevState.syncInfo.startTime
                ? Date.now() - prevState.syncInfo.startTime
                : 0,
              error: payload?.errorMessage,
            },
          }))
          // Reload Store on success
          if (payload?.completed) {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            queryClient.invalidateQueries({ queryKey: ['book'] })
            queryClient.invalidateQueries({ queryKey: ['categoryGroups'] })
            queryClient.invalidateQueries({ queryKey: ['institutions'] })
            queryClient.invalidateQueries({ queryKey: ['tags'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
          }
        },
      )

      // ON_UPDATE_AUTHENTICATED_USER
      removeOnUpdateAuthenticatedUser = CommandsClient.addAppEventListener(
        AppEventIds.ON_UPDATE_AUTHENTICATED_USER,
        (payload) => {
          logger.debug('ON_UPDATE_AUTHENTICATED_USER', payload)
          queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
            ...prevState,
            authenticatedUser: payload,
          }))

          // If book is open, we might want to refresh the book data
          if (bookOpen) {
            queryClient.invalidateQueries({ queryKey: ['users'] })
          }
        },
      )

      // ON_USER_SETTINGS_UPDATED
      removeOnUserSettingsUpdated = CommandsClient.addAppEventListener(
        AppEventIds.ON_USER_SETTINGS_UPDATED,
        (payload) => {
          logger.debug('ON_USER_SETTINGS_UPDATED', payload)
          queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
            ...prevState,
            userSettings: payload,
          }))
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
