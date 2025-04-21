import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './TagsField.stories'

const { Default } = composeStories(stories)

describe('TagField tests', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', () => {
    renderWithTheme(<Default />)
    const [title] = screen.getAllByText('Tags Field')
    expect(title).toBeInTheDocument()
    const inputField = screen.getByRole('combobox')
    expect(inputField).toBeInTheDocument()
  })

  it('adds a tag when input is submitted', () => {
    const handleChange = vi.fn()
    renderWithTheme(<Default onChange={handleChange} />)
    const inputField = screen.getByRole('combobox')
    fireEvent.change(inputField, { target: { value: 'Tag 1' } })
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' })
    const addedTag = screen.getByText('Tag 1')
    expect(addedTag).toBeInTheDocument()
  })
})
