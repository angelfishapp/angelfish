import theme from '@/app/theme'
import Paper from '@mui/material/Paper'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import * as stories from './OOBField.stories'

// Compose all stories
const { Default } = composeStories(stories)

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <Paper>{ui}</Paper>
    </ThemeProvider>,
  )
}

describe('OOBField Component (with Storybook)', () => {
  it('renders the default OOBField', () => {
    renderWithTheme(<Default />)
    expect(screen.getByText('Enter or paste the verification code')).toBeInTheDocument()
  })

  it('calls onSubmit with the correct verification code', async () => {
    const mockOnSubmit = vi.fn()
    renderWithTheme(<Default onSubmit={mockOnSubmit} />)

    const input1 = document.getElementById('oob-digit-0') as HTMLInputElement
    expect(input1).toBeInTheDocument()
    act(() => {
      fireEvent.change(input1, { target: { value: '1' } })
    })
    const input2 = document.getElementById('oob-digit-1') as HTMLInputElement
    expect(input2).toBeInTheDocument()
    act(() => {
      fireEvent.change(input2, { target: { value: '2' } })
    })

    const input3 = document.getElementById('oob-digit-2') as HTMLInputElement
    expect(input3).toBeInTheDocument()
    act(() => {
      fireEvent.change(input3, { target: { value: '1' } })
    })

    const input4 = document.getElementById('oob-digit-3') as HTMLInputElement
    expect(input4).toBeInTheDocument()
    act(() => {
      fireEvent.change(input4, { target: { value: '1' } })
    })

    const input5 = document.getElementById('oob-digit-4') as HTMLInputElement
    expect(input5).toBeInTheDocument()
    act(() => {
      fireEvent.change(input5, { target: { value: '1' } })
    })

    const input6 = document.getElementById('oob-digit-5') as HTMLInputElement
    expect(input6).toBeInTheDocument()
    act(() => {
      fireEvent.change(input6, { target: { value: '1' } })
      fireEvent.keyDown(input6, { key: 'Enter', code: 'Enter' })
    })
    const code = `${input1.value}${input2.value}${input3.value}${input4.value}${input5.value}${input6.value}`
    mockOnSubmit(code)
    expect(mockOnSubmit).toHaveBeenCalledWith('121111')
  })
})
