import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './DropdownMenuButton.stories'

const { Default, NoIcons, TextButton, ContainedButton, OutlinedButton } = composeStories(stories)

describe('renders TextButton DropdownMenu', () => {
  const mockAction = vi.fn()

  test('checks menu and DeleteIcon interaction', async () => {
    render(<Default onClick={mockAction} />)

    const moreIconButton = screen.getByTestId('MoreHorizIcon')
    expect(moreIconButton).toBeInTheDocument()

    userEvent.click(moreIconButton)

    const title = await screen.findByText(/Sub Menu Header 1/i)
    expect(title).toBeInTheDocument()

    const option2 = await screen.findByText(/Menu Item 1/i)
    expect(option2).toBeInTheDocument()

    const title2 = await screen.findByText(/Sub Menu Header 2/i)
    expect(title2).toBeInTheDocument()

    const option1 = await screen.findByText(/Menu Item 5/i)
    expect(option1).toBeInTheDocument()

    const deleteIcon = await screen.findByTestId('DeleteIcon')
    expect(deleteIcon).toBeInTheDocument()

    await userEvent.click(option1)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  test('renders NoIcons DropdownMenu', async () => {
    render(<NoIcons onClick={mockAction} />)

    const moreIconButton = screen.getByTestId('MoreHorizIcon')
    expect(moreIconButton).toBeInTheDocument()

    userEvent.click(moreIconButton)

    const title = await screen.findByText(/Sub Menu Header 1/i)
    expect(title).toBeInTheDocument()

    const option2 = await screen.findByText(/Menu Item 1/i)
    expect(option2).toBeInTheDocument()

    const title2 = await screen.findByText(/Sub Menu Header 2/i)
    expect(title2).toBeInTheDocument()

    const option1 = await screen.findByText(/Menu Item 5/i)
    expect(option1).toBeInTheDocument()

    await userEvent.click(option1)
    expect(mockAction).toHaveBeenCalledTimes(2)
  })
  test('renders TextButton DropdownMenu', async () => {
    render(<TextButton onClick={mockAction} />)

    const selectButton = screen.getByText(/Select/i)
    expect(selectButton).toBeInTheDocument()
    expect(selectButton).toHaveClass('MuiButton-text')

    userEvent.click(selectButton)

    const title = await screen.findByText(/Sub Menu Header 1/i)
    expect(title).toBeInTheDocument()

    const option2 = await screen.findByText(/Menu Item 1/i)
    expect(option2).toBeInTheDocument()

    const title2 = await screen.findByText(/Sub Menu Header 2/i)
    expect(title2).toBeInTheDocument()

    const option1 = await screen.findByText(/Menu Item 5/i)
    expect(option1).toBeInTheDocument()

    const deleteIcon = await screen.findByTestId('DeleteIcon')
    expect(deleteIcon).toBeInTheDocument()

    await userEvent.click(option1)
    expect(mockAction).toHaveBeenCalledTimes(3)
  })
  test('renders ContainedButton DropdownMenu', async () => {
    render(<ContainedButton />)

    const selectButton = screen.getByText(/Select/i)
    expect(selectButton).toBeInTheDocument()
    expect(selectButton).toHaveClass('MuiButton-contained')

    userEvent.click(selectButton)

    const title = await screen.findByText(/Sub Menu Header 1/i)
    expect(title).toBeInTheDocument()

    const option2 = await screen.findByText(/Menu Item 1/i)
    expect(option2).toBeInTheDocument()

    const title2 = await screen.findByText(/Sub Menu Header 2/i)
    expect(title2).toBeInTheDocument()

    const deleteIcon = await screen.findByTestId('DeleteIcon')
    expect(deleteIcon).toBeInTheDocument()

    const option1 = await screen.findByText(/Menu Item 5/i)
    expect(option1).toBeInTheDocument()
  })
  test('renders OutlinedButton DropdownMenu', async () => {
    render(<OutlinedButton />)

    const selectButton = screen.getByText(/Select/i)
    expect(selectButton).toBeInTheDocument()
    expect(selectButton).toHaveClass('MuiButton-outlined')


    userEvent.click(selectButton)

    const title = await screen.findByText(/Sub Menu Header 1/i)
    expect(title).toBeInTheDocument()

    const option2 = await screen.findByText(/Menu Item 1/i)
    expect(option2).toBeInTheDocument()

    const title2 = await screen.findByText(/Sub Menu Header 2/i)
    expect(title2).toBeInTheDocument()
    
    const deleteIcon = await screen.findByTestId('DeleteIcon')
    expect(deleteIcon).toBeInTheDocument()

    const option1 = await screen.findByText(/Menu Item 5/i)
    expect(option1).toBeInTheDocument()
  })
})
