import { useGetAppState } from '@/hooks/app'

/**
 * React-Query Hook to get Book current loaded book
 *
 * @returns       book (IBook), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useGetBook = () => {
  const { appState, isLoading, isFetching, error } = useGetAppState()
  const { book } = appState ?? {}
  return { book, isLoading, isFetching, error }
}
