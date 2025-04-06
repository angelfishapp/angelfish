import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AccountTypeField.stories'

const { Default } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Account Type Field/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Search Account Types...')  as HTMLInputElement
    expect(input).toBeInTheDocument()
    const arrow = screen.getByTestId('ArrowDropDownIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)
    const cashAccounts = await screen.findByText(/Cash Accounts/i)
    expect(cashAccounts).toBeInTheDocument()
    const creditCards = await screen.findByText(/credit Cards/i)
    expect(creditCards).toBeInTheDocument()
    const HSACashAccount = await screen.findByText(/HSA Cash Account/i)
    expect(HSACashAccount).toBeInTheDocument()
    fireEvent.click(HSACashAccount)
    expect(input.value).toBe('HSA Cash Account')
    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    expect(input.value).toBe('')
  })
})
