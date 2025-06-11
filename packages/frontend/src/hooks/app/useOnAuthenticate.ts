import { useQueryClient } from '@tanstack/react-query'

import { onAuthenticate as apiOnAuthenticate } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { IFrontEndAppState } from './FrontEndAppState.interface'

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
    queryClient.setQueryData(APP_QUERY_KEYS.APPSTATE, (prevState: IFrontEndAppState) => ({
      ...prevState,
      authenticatedUser,
      isAuthenticated: true,
    }))
  }
  return { onAuthenticate }
}
