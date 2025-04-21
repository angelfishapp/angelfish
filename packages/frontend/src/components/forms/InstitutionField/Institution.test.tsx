import theme from '@/app/theme'
import { institutions as INSTITUTIONS } from '@angelfish/tests/fixtures'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import * as stories from './InstitutionField.stories'

const { EmptyValue, WithValue } = composeStories(stories)

describe('InstitutionField', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<EmptyValue />)
    expect(screen.getByPlaceholderText('Search Institutions...')).toBeInTheDocument()
  })

  it('displays options when typing', () => {
    renderWithTheme(<EmptyValue {...EmptyValue.args} />)
    const input = screen.getByPlaceholderText('Search Institutions...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Bank' } })

    INSTITUTIONS.forEach((institution) => {
      if (institution.name.includes('Bank')) {
        expect(screen.getByText(institution.name)).toBeInTheDocument()
      }
    })
  })

  it('calls onChange when an option is selected', () => {
    const handleChange = vi.fn()
    renderWithTheme(<EmptyValue onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Search Institutions...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: INSTITUTIONS[0].name } })
    fireEvent.click(screen.getByText(INSTITUTIONS[0].name))

    expect(handleChange).toHaveBeenCalledWith(INSTITUTIONS[0])
  })

  it('renders the selected value with an icon', () => {
    renderWithTheme(<WithValue />)
    const input = screen.getByPlaceholderText('Search Institutions...')
    expect(input).toHaveValue(INSTITUTIONS[1].name)
  })
})
