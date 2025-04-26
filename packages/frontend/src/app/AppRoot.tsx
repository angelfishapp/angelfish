import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import reduxStore from '@/redux/store'
import { AppRootStyles } from './AppRoot.styles'
import theme from './theme'

import { AppContainer } from '@/containers/AppContainer'

/**
 * Root Component
 * Initalises app wide providers like themes, Redux, Date picker etc.
 */

const queryClient = new QueryClient()

export default function AppRoot() {
  // Render
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* CSS Reset: Provides basic style normalizations. */}
        <CssBaseline />
        <GlobalStyles styles={AppRootStyles} />
        {/** react-query provider */}

        <QueryClientProvider client={queryClient}>
          {/* Redux provider */}
          <Provider store={reduxStore}>
            <HashRouter>
              {/* App */}
              <AppContainer />
            </HashRouter>
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
