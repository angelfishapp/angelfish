import { AuthScreen } from '@/app/components/AuthScreen'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import queryClient from '@/providers/ReactQueryClient'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import type { IUserSettings } from '@angelfish/core/src/types'
import type { AuthScreenContainerProps } from './AuthScreenContainer.interface'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/

/**
 * Send an OOB Code to user's email
 *
 * @param email     User's login email address
 * @throws          Error if unsuccessful
 */
async function onGetOOBCode(email: string) {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_SEND_OOB_CODE, { email })
  queryClient.invalidateQueries({ queryKey: ['appState'] })
}

/**
 * Authenticate a user using an OOB Code sent to their email
 *
 * @param oob_code  The OOB Code sent to the user's email
 * @throws          Error if unsuccessful authentication
 */
async function onAuthenticate(oob_code: string) {
  await CommandsClient.executeAppCommand(AppCommandIds.AUTH_AUTHENTICATE, { oob_code })
}

/**
 * Container for AuthScreen
 */
export default function AuthScreenContainer({ children }: AuthScreenContainerProps) {
  // State
  const { appState } = useGetAppState()
  const isAuthenticated = appState?.authenticated as boolean
  const userSettings = appState?.userSettings as IUserSettings

  // Render
  return (
    <AuthScreen
      onGetOOBCode={onGetOOBCode}
      onAuthenticate={onAuthenticate}
      isAuthenticated={isAuthenticated}
      disableBackgroundAnimation={!userSettings.enableBackgroundAnimations}
    >
      {children}
    </AuthScreen>
  )
}
