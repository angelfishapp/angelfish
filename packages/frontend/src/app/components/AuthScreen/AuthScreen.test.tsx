// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './AuthScreen.stories'

vi.mock('lottie-web', () => ({
  loadAnimation: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn(),
  }),
}))
globalThis.Path2D = class {
  constructor() {}
  addPath = vi.fn()
} as any

HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === '2d') {
    return {
      fillStyle: '',
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: [],
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawFocusIfNeeded: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      translate: vi.fn(),
      transform: vi.fn(),
      resetTransform: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      save: vi.fn(),
      restore: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      font: '',
    }
  }
  return null
})

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
