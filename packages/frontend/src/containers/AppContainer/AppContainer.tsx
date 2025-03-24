import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppLayout } from '@/app/components/AppLayout'
import { AuthScreenContainer } from '@/containers/AuthScreenContainer'
import { SetupScreenContainer } from '@/containers/SetupScreenContainer'
import { getAppState } from '@/redux/app/actions'
import { selectAuthenticatedUser, selectBook, selectIsInitialised } from '@/redux/app/selectors'
import { initStore, startIPCChannels } from '@/redux/common/actions'
import type { IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, AppProcessIDs, CommandsClient } from '@angelfish/core'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/

/**
 * Log current user out of the App
 */
async function onLogout() {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
}

/**
 * Container for main Application
 */
export default function AppContainer() {
  // Component State
  const [showSetup, setShowSetup] = React.useState<boolean>(false)

  // Redux State
  const dispatch = useDispatch()
  const isInitialised = useSelector(selectIsInitialised)
  const authenticatedUser = useSelector(selectAuthenticatedUser)
  const book = useSelector(selectBook)

  /**
   * Check the current App state on component mount and start IPC Channel
   * listeners for App state changes from Main process
   */
  React.useEffect(() => {
    CommandsClient.isReady([AppProcessIDs.MAIN, AppProcessIDs.WORKER]).then(() => {
      dispatch(getAppState({}))
      dispatch(startIPCChannels({}))
    })
  }, [dispatch])

  /**
   * Set App state once Redux Store is Initialised
   */
  React.useEffect(() => {
    if (isInitialised) {
      // If no book loaded, will need to run setup
      if (!book) {
        setShowSetup(true)
      } else {
        setShowSetup(false)
      }
    }
  }, [isInitialised, book])

  /**
   * Reload Redux Store whenever book changes
   */
  React.useEffect(() => {
    if (book) {
      dispatch(initStore({}))
    }
  }, [book, dispatch])

  // Render
  // Will show loading until App is initialised
  if (isInitialised) {
    // Render
    return (
      <AuthScreenContainer>
        {showSetup ? (
          <SetupScreenContainer onComplete={() => setShowSetup(false)} />
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
