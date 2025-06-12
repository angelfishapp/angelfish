import { useGetAppState } from './useGetAppState'

/**
 * React-Query Hook to get current Authenticated User profile
 *
 * @returns   authenticatedUser (IAuthenticatedUser), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useGetAuthenticatedUser = () => {
  const { appState, isLoading, isFetching, error } = useGetAppState()
  const { authenticatedUser } = appState ?? {}
  return { authenticatedUser, isLoading, isFetching, error }
}
