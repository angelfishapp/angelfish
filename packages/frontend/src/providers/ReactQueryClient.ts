import { QueryClient } from '@tanstack/react-query'

/**
 * 
 * React Query Client Config for the application.
 * this will handle to keep the cache for the data in the application.
 * this will also handle the refetching of the data when the window is focused.
 * 
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, 
      gcTime: Infinity, // this will make sure cache is not removed collected
      refetchOnWindowFocus: false,
    },
  },
})

export default queryClient
