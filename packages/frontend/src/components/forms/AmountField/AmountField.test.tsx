import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AmountField.stories'

const { Default } = composeStories(stories)

describe('renders AmountField Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Amount/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByRole('textbox')  as HTMLInputElement
    expect(input).toBeInTheDocument()
    const DollarSign = screen.getByText('$')
    expect(DollarSign).toBeInTheDocument()
    const helperText = screen.getByText(/Enter amount/i)
    expect(helperText).toBeInTheDocument()
    fireEvent.change(input, { target: { value:"alpahpet" } })
    expect(input.value).toBe('')
    fireEvent.change(input, { target: { value:22 } })
    expect(!isNaN(Number(input.value))).toBe(true)

  })
})
