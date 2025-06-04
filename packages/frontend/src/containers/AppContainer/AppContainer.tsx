import React from 'react'

import { AppLayout } from '@/app/components/AppLayout'
import { AuthScreenContainer } from '@/containers/AuthScreenContainer'
import { SetupScreenContainer } from '@/containers/SetupScreenContainer'
import { useGetBook } from '@/hooks'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import { setupIPCListeners } from '@/hooks/app/useHandleAppState'
import type { IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, AppProcessIDs, CommandsClient } from '@angelfish/core'
import { queryClient } from '@/providers'
import { LoadingSpinner } from '@/components/LoadingSpinner'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/

/**
 * Log current user out of the App
 */
async function onLogout() {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
  queryClient.invalidateQueries({ queryKey: ['appState'] })
}

/**
 * Container for main Application
 */
export default function AppContainer() {
  // Component State
  const [showSetup, setShowSetup] = React.useState<boolean>(false)
  const [setupInProgress, setSetupInProgress] = React.useState<boolean>(false)
  const appState = useGetAppState() // this line will call and sett app State in context
  // Redux State
  const { book } = useGetBook()
  const authenticatedUser = appState?.authenticatedUser
  const isInitialised = appState?.isInitialised ?? false
  /**
   * Check the current App state on component mount and start IPC Channel
   * listeners for App state changes from Main process
   */

  React.useEffect(() => {
    CommandsClient.isReady([AppProcessIDs.MAIN, AppProcessIDs.WORKER]).then(() => {
      const removeListeners = setupIPCListeners()
      return () => {
        removeListeners()
      }
    })
  }, [])

  /**
   * Set App state once Redux Store is Initialised
   */
  React.useEffect(() => {
    if (isInitialised) {
      if (book && !setupInProgress) {
        setShowSetup(false)
      } else {
        setShowSetup(true)
      }
    }
  }, [isInitialised, book, setupInProgress])
  if (appState?.isLoading) return <LoadingSpinner />
  // Will show loading until App is initialised
  if (isInitialised) {
    // Render
    return (
      <AuthScreenContainer>
        {showSetup ? (
          <SetupScreenContainer
            onStart={() => setSetupInProgress(true)}
            onComplete={() => {
              setShowSetup(false)
              setSetupInProgress(false)
            }}
          />
        ) : (
          <AppLayout
            authenticatedUser={authenticatedUser as IAuthenticatedUser}
            onLogout={onLogout}
          />
        )}
      </AuthScreenContainer>
    )
  }
  // TODO - Show Loading Here
  return null
}
