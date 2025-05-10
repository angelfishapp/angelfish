import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { Preview } from '@storybook/react'
import React from 'react'
import apptheme from '../src/app/theme'

// Stop Prettier plugins from removing the React import
void React

const preview: Preview = {
  decorators: [
    (story) => (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={apptheme}>
          {/* CSS Reset: Provides basic style normalizations. */}
          <CssBaseline />
          {story()}
        </ThemeProvider>
      </StyledEngineProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'angelfish',
      values: [
        {
          name: 'angelfish',
          value: 'linear-gradient(180deg, #47ccaf 0%, #1b97de 100%) fixed',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
