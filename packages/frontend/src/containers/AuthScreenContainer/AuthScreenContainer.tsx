import { useQueryClient } from '@tanstack/react-query'

import { onAuthenticate, onGetOOBCode } from '@/api'
import { AuthScreen } from '@/app/components/AuthScreen'
import type { IFrontEndAppState } from '@/hooks'
import { useGetAppState } from '@/hooks'
import type { IUserSettings } from '@angelfish/core/src/types'
import type { AuthScreenContainerProps } from './AuthScreenContainer.interface'

/**
 * Container for AuthScreen
 */
export default function AuthScreenContainer({ children }: AuthScreenContainerProps) {
  // State
  const queryClient = useQueryClient()
  const { appState } = useGetAppState()
  const isAuthenticated = appState?.authenticated ?? false
  const userSettings = appState?.userSettings as IUserSettings

  // Render
  return (
    <AuthScreen
      onGetOOBCode={async (email) => {
        await onGetOOBCode({ email })
      }}
      onAuthenticate={async (oob_code) => {
        const authenticatedUser = await onAuthenticate({ oob_code })
        queryClient.setQueryData(['appState'], (prevState: IFrontEndAppState) => ({
          ...prevState,
          authenticatedUser,
          isAuthenticated: true,
        }))
      }}
      isAuthenticated={isAuthenticated}
      disableBackgroundAnimation={!userSettings.enableBackgroundAnimations}
    >
      {children}
    </AuthScreen>
  )
}
