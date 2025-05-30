import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HashRouter } from 'react-router-dom'

import { AppRootStyles } from './AppRoot.styles'
import theme from './theme'

import { AppContainer } from '@/containers/AppContainer'
import { AppProvider, useAppContext } from '@/providers/AppContext'
import { setAppContextRef } from '@/providers/AppContextRef'
import queryClient from '@/providers/ReactQueryClient'
import { useEffect } from 'react'

/**
 * Root Component
 * Initalises app wide providers like themes, Redux, Date picker etc.
 */

export default function AppRoot() {
  const ContextBridge = () => {
    const context = useAppContext()

    useEffect(() => {
      setAppContextRef(context)
    }, [context])

    return null
  }
  // Render
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* CSS Reset: Provides basic style normalizations. */}
        <CssBaseline />
        <GlobalStyles styles={AppRootStyles} />
        {/** react-query provider */}

        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* Redux provider */}
          {/* <Provider store={reduxStore}> */}
          <AppProvider>
            <ContextBridge />
            {/* App Context Provider */}
            {/* <AppContextProvider> */}
            {/* Main Application Router */}
            <HashRouter>
              {/* App */}
              <AppContainer />
            </HashRouter>
          </AppProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
