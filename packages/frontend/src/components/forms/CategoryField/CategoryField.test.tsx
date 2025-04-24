import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CategoryField.stories'

const { Default, WithValue, Filtered, ShowAsTextField } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()
    act(() => {
      fireEvent.change(textBox, { target: { value: 'cleaning' } })
      fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    const textBoxWithValue = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWithValue).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    act(() => {
      fireEvent.click(closeIcon)
    })
    expect(textBox).toBeInTheDocument()
  })

  test('render of WithValue Story', async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <WithValue />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBoxWithValue = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWithValue).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    act(() => {
      fireEvent.click(closeIcon)
    })
    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()
  })
  test('render of ShowAsTextField Story', async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ShowAsTextField />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBoxWIthEmoji = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWIthEmoji).not.toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()

    act(() => {
      fireEvent.change(textBox, { target: { value: 'cleaning' } })
    })
    act(() => {
      fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    const textBoxWithValue = screen.getByDisplayValue('Car > Wash/Cleaning')
    expect(textBoxWithValue).toBeInTheDocument()

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    act(() => {
      fireEvent.click(closeIcon)
    })

    expect(textBox).toBeInTheDocument()
  })
  test('render of Filtered Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Filtered />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Bank Accounts/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Bank Accounts.../i)
    expect(textBox).toBeInTheDocument()

    act(() => {
      fireEvent.change(textBox, { target: { value: 'Checking Account' } })
    })

    act(() => {
      fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    expect(textBox).toHaveAttribute('value', 'Checking Account')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    act(() => {
      fireEvent.click(closeIcon)
    })

    expect(textBox).toBeInTheDocument()
  })
})
