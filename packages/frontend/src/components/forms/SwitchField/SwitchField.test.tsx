import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'

import React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './SwitchField.stories'

const { Default } = composeStories(stories)

describe('SwitchField tests', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<Default />)
    expect(screen.getByText('Switch Field')).toBeInTheDocument()
    const switchInput = screen.getByRole('checkbox')
    expect(switchInput).toBeInTheDocument()
    expect(switchInput).not.toBeChecked()
  })

  it('toggles the switch when clicked', () => {
    const handleChange = vi.fn()
    renderWithTheme(<Default label="Switch Field" value={false} onChange={handleChange} />)
    const switchInput = screen.getByRole('checkbox')
    fireEvent.click(switchInput)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('renders with default value', () => {
    renderWithTheme(<Default label="Switch Field" defaultValue={true} onChange={() => {}} />)
    const switchInput = screen.getByRole('checkbox')
    expect(switchInput).toBeChecked()
  })
})
