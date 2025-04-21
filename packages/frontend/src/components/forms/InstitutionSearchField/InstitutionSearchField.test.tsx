import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import * as stories from './InstitutionSearchField.stories'

const { EmptyValue, WithValue } = composeStories(stories)

describe('InstitutionField', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<EmptyValue />)
    const [title] = screen.getAllByText(/Institution Search Field/i)
    expect(title).toBeInTheDocument()
  })

  it('displays options when typing', () => {
    renderWithTheme(<EmptyValue {...EmptyValue.args} />)
    const input = screen.getByPlaceholderText('Type in Institution Name...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Chase' } })
    expect(input.value).toBe('Chase')
  })

  it('calls onChange when an option is selected', () => {
    const handleChange = vi.fn()
    renderWithTheme(<EmptyValue onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Type in Institution Name...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Chase' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(input.value).toBe('Chase')
  })

  it('renders the selected value with an icon', () => {
    renderWithTheme(<WithValue />)

    const input = screen.getByPlaceholderText('Type in Institution Name...')
    expect(input).toHaveValue(WithValue.args.value)
  })
})
