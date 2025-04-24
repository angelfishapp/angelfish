// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './AuthScreen.stories'

const { Default } = composeStories(stories)

describe('AuthLogin tests', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders login form without crashing', () => {
    vi.mock('@/app/context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
      }),
    }))

    renderWithTheme(<Default isAuthenticated={false} />)

    expect(screen.getByText(/Enter Your Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/aquaman@atlantis.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Code to Email/i })).toBeInTheDocument()
  })
})
