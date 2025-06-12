import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HashRouter } from 'react-router-dom'

import { AppRootStyles } from './AppRoot.styles'
import { AppReactQueryClient } from './ReactQuery'
import theme from './theme'

import { AppContainer } from '@/containers/AppContainer'

/**
 * Root Component
 * Initalises app wide providers like themes, Redux, Date picker etc.
 */

export default function AppRoot() {
  // Render
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* CSS Reset: Provides basic style normalizations. */}
        <CssBaseline />
        <GlobalStyles styles={AppRootStyles} />
        {/** react-query provider */}
        <QueryClientProvider client={AppReactQueryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* Main Application Router */}
          <HashRouter>
            {/* App */}
            <AppContainer />
          </HashRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
