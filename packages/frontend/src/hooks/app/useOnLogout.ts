import { useQueryClient } from '@tanstack/react-query'

import { onLogout as apiOnLogout } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'

/**
 * React-Query Hook to get authentication function to logout a user.
 *
 * @returns   onLogout (function)
 */
export const useOnLogout = () => {
  const queryClient = useQueryClient()
  const onLogout = async () => {
    // Call the API to logout the user
    await apiOnLogout()
    queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.APPSTATE })
  }
  return { onLogout }
}
