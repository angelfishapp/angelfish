import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './UserField.stories'

const { Default } = composeStories(stories)

describe('UserField tests', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<Default />)
    const [title] = screen.getAllByText('User Field')
    expect(title).toBeInTheDocument()
    const inputField = screen.getByRole('combobox')
    expect(inputField).toBeInTheDocument()
  })

  it('adds a tag when input is submitted', () => {
    const handleChange = vi.fn()
    renderWithTheme(<Default onChange={handleChange} />)
    const inputField = screen.getByRole('combobox')
    fireEvent.change(inputField, { target: { value: 'John Smith' } })
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' })

    const addedTag = screen.getByText('John Smith')
    expect(addedTag).toBeInTheDocument()
  })
})
