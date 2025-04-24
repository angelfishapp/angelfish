import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AmountField.stories'

const { Default, DefaultValue } = composeStories(stories)

describe('renders AmountField Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Amount/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    const DollarSign = screen.getByText('$')
    expect(DollarSign).toBeInTheDocument()
    const helperText = screen.getByText(/Enter amount/i)
    expect(helperText).toBeInTheDocument()
    act(() => {
      fireEvent.change(input, { target: { value: 'alpahpet' } })
    })
    expect(input.value).toBe('')
    act(() => {
      fireEvent.change(input, { target: { value: 22 } })
    })
    expect(!isNaN(Number(input.value))).toBe(true)
  })
  test('render of DefaultValue Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DefaultValue />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Amount/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    const DollarSign = screen.getByText('£')
    expect(DollarSign).toBeInTheDocument()
    expect(input.value).toBe('1,222.22')
    act(() => {
      fireEvent.change(input, { target: { value: 'alpahpet' } })
    })
    expect(input.value).toBe('')
    act(() => {
      fireEvent.change(input, { target: { value: 22 } })
    })
    expect(!isNaN(Number(input.value))).toBe(true)
  })
})
