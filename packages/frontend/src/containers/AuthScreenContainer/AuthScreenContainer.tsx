import { onGetOOBCode } from '@/api'
import { AuthScreen } from '@/app/components/AuthScreen'
import { useGetAppState, useOnAuthenticate } from '@/hooks'
import type { IUserSettings } from '@angelfish/core/src/types'
import type { AuthScreenContainerProps } from './AuthScreenContainer.interface'

/**
 * Container for AuthScreen
 */
export default function AuthScreenContainer({ children }: AuthScreenContainerProps) {
  // State
  const { appState } = useGetAppState()
  const { onAuthenticate } = useOnAuthenticate()
  const isAuthenticated = appState?.authenticated ?? false
  const userSettings = appState?.userSettings as IUserSettings

  // Render
  return (
    <AuthScreen
      onGetOOBCode={async (email) => {
        await onGetOOBCode({ email })
      }}
      onAuthenticate={onAuthenticate}
      isAuthenticated={isAuthenticated}
      disableBackgroundAnimation={!userSettings.enableBackgroundAnimations}
    >
      {children}
    </AuthScreen>
  )
}
