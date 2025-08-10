import { getAppLocalization } from '@/api'
import { APP_QUERY_KEYS } from '@/app/ReactQuery'
import type { AppCommandIds, AppCommandRequest } from '@angelfish/core'
import { useQuery } from '@tanstack/react-query'

/**
 * React-Query Hook to get Localisation Data
 *
 * @returns       localization (ILocalization), isLoading (boolean), isFetching (boolean), error (Error | null)
 */
export const useGetLocalization = (_request: AppCommandRequest<AppCommandIds.GET_LOCALIZATION>) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: APP_QUERY_KEYS.LOCALIZATION,
    queryFn: async () => getAppLocalization(_request),
  })
  return { data, isLoading, isFetching, error, refetch }
}
