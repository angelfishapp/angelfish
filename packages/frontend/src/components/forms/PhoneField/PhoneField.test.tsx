import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './PhoneField.stories'

const { Default } = composeStories(stories)

describe('Phone Field', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<Default />)
    expect(screen.getAllByText('Phone Field')[0]).toBeInTheDocument()
    const input = document.getElementById(':r0:') as HTMLInputElement
    expect(input).toBeInTheDocument()
    act(() => {
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '970' } })
    })

    expect(input).toHaveValue('+970                ')
    const flag = document.querySelector('[title="Palestine, State of"]')
    expect(flag).toBeInTheDocument()
  })
})
