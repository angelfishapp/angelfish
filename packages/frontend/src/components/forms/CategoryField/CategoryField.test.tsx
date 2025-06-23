import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CategoryField.stories'

const { Default, WithValue, Filtered, ShowAsTextField, MultiSelect } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    const { container } = render(<Default />)

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()
    fireEvent.change(textBox, { target: { value: 'cleaning' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    const textBoxWithValue = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWithValue).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    expect(textBox).toBeInTheDocument()
  })

  test('render of WithValue Story', async () => {
    const { container } = render(<WithValue />)

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBoxWithValue = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWithValue).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()
  })
  test('render of ShowAsTextField Story', async () => {
    const { container } = render(<ShowAsTextField />)

    const [title] = screen.getAllByText(/Category/i)
    expect(title).toBeInTheDocument()

    const textBoxWIthEmoji = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWIthEmoji).not.toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Categories/i)
    expect(textBox).toBeInTheDocument()
    fireEvent.change(textBox, { target: { value: 'cleaning' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    const textBoxWithValue = screen.getByDisplayValue('Car > Wash/Cleaning')
    expect(textBoxWithValue).toBeInTheDocument()

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)

    expect(textBox).toBeInTheDocument()
  })
  test('render of Filtered Story', async () => {
    render(<Filtered />)

    const [title] = screen.getAllByText(/Bank Accounts/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Bank Accounts.../i)
    expect(textBox).toBeInTheDocument()

    fireEvent.change(textBox, { target: { value: 'Checking Account' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(textBox).toHaveAttribute('value', 'Checking Account')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)

    expect(textBox).toBeInTheDocument()
  })
  test('renders of MultiSelect Story', async () => {
    render(<MultiSelect />)

    const [title] = screen.getAllByText(/MultiSelect/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Categories.../i)
    expect(textBox).toBeInTheDocument()

    fireEvent.change(textBox, { target: { value: 'Interest' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(textBox).toHaveAttribute('value', 'Interest')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)

    expect(textBox).toBeInTheDocument()
  })
})
