import React from 'react'

import { AppLayout } from '@/app/components/AppLayout'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { AuthScreenContainer } from '@/containers/AuthScreenContainer'
import { SetupScreenContainer } from '@/containers/SetupScreenContainer'
import { useGetBook } from '@/hooks'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import { useHandleAppState } from '@/hooks/app/useHandleAppState'
import type { IAuthenticatedUser } from '@angelfish/core'
import { onLogout } from '@/api'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/



/**
 * Container for main Application
 */
export default function AppContainer() {
  // Component State
  const [showSetup, setShowSetup] = React.useState<boolean>(false)
  const [setupInProgress, setSetupInProgress] = React.useState<boolean>(false)

  // React-Query State
  const { appState, isLoading } = useGetAppState() // this line will call and sett app State in context
  const { book } = useGetBook()
  const authenticatedUser = appState?.authenticatedUser
  const isInitialised = appState?.isInitialised ?? false

  // Start listening to App events
  useHandleAppState()

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

  // Show loading spinner while app is loading
  if (isLoading) return <LoadingSpinner size={400} />

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
