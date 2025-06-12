import { useQueryClient } from '@tanstack/react-query'

import { onAuthenticate as apiOnAuthenticate } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { IFrontEndAppState } from './FrontEndAppState.interface'
import { DEFAULT_APP_STATE } from './useGetAppState'

/**
 * React-Query Hook to get authentication function to authenticate a user.
 *
 * @returns   onAuthenticate (function)
 */
export const useOnAuthenticate = () => {
  const queryClient = useQueryClient()
  const onAuthenticate = async (oob_code: string) => {
    // Call the API to authenticate the user with the provided oob_code
    const authenticatedUser = await apiOnAuthenticate({ oob_code })
    queryClient.setQueryData<IFrontEndAppState>(APP_QUERY_KEYS.APPSTATE, (prevState) => {
      if (!prevState) {
        return {
          ...DEFAULT_APP_STATE,
          authenticated: true,
          authenticatedUser,
        }
      }
      return {
        ...prevState,
        authenticated: true,
        authenticatedUser,
      }
    })
  }
  return { onAuthenticate }
}
