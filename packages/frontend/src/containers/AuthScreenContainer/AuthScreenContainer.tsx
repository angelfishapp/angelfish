import { AuthScreen } from '@/app/components/AuthScreen'
import { useGetAppState } from '@/hooks/app/useGetAppState'
import type { IUserSettings } from '@angelfish/core/src/types'
import type { AuthScreenContainerProps } from './AuthScreenContainer.interface'
import { onAuthenticate, onGetOOBCode } from '@/api'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/



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
