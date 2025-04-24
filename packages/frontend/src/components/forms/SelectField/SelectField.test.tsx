import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'

import { act, fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import * as stories from './SelectField.stories'

const { Default } = composeStories(stories)

describe('SelectFIeld tests ', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

  it('renders without crashing', async () => {
    renderWithTheme(<Default />)
    expect(screen.getByText('Select Field')).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    act(() => {
      fireEvent.mouseDown(input)
    })

    const option1 = document.querySelector('[data-value="1"]') as HTMLElement
    expect(option1).toBeInTheDocument()
    expect(option1).toHaveTextContent('Option 1')
    act(() => {
      fireEvent.mouseDown(option1)
    })
    const selectedOption = screen.getByText('Option 1')
    expect(selectedOption).toBeInTheDocument()
  })
})
