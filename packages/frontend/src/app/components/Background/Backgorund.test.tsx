import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { render } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './Background.stories'

const { LandDay, SubmergedEvening } = composeStories(stories)

describe('Background component tests', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders PrimaryBackground without crashing', () => {
    const { container } = renderWithTheme(<LandDay />)
    expect(container.querySelector('.land_bg_water')).toBeInTheDocument()
    expect(container.querySelector('.login_splash')).toBeInTheDocument()
    expect(container.querySelector('.water-shimmer')).toBeInTheDocument()
    expect(container.querySelector('.mountains_left')).toBeInTheDocument()
    expect(container.querySelector('.mountains_right')).toBeInTheDocument()
    expect(container.querySelector('.underwater_bg')).toBeInTheDocument()
  })

  it('renders SubmergedEvening without crashing', () => {
    const { container } = renderWithTheme(<SubmergedEvening />)
    expect(container.querySelector('.underwater_bg')).toBeInTheDocument()
    expect(container.querySelector('.aquarium')).toBeInTheDocument()
    expect(container.querySelector('.water-shimmer')).toBeInTheDocument()
  })
})
