import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CurrencyField.stories'

const { Default } = composeStories(stories)

describe('renders CurrencyField Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Currency Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Search Currencies...') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const helperText = screen.getByText(/Select a Currency from the list/i)
    expect(helperText).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'GBP' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(input.value).toBe('British Pound Sterling (GBP)')
  })
})
