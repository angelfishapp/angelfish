import { action } from '@storybook/addon-actions'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './ContextMenu.stories' // Ensure correct path

const composed = composeStories(stories)
// to-check: this a partial test should I do it for all the  Items we have 
describe('Context Menu', () => {
  test('calls onConfirm when confirm button is clicked', async () => {
    const mockAction = vi.fn() 
    const items = composed.Default.args.items
    if (items) {
      items[1].onClick = mockAction 
    }
    render(<composed.Default />)

    const elementToRightClick = screen.getByText(/Right Click On Me/i)

    fireEvent.contextMenu(elementToRightClick)

    const contextMenu = screen.getByRole('menu') 
    expect(contextMenu).toBeInTheDocument()
    const title = screen.getByText(/My context Menu/i)
    expect(title).toBeInTheDocument()
    const option1 = screen.getByText(/option 1-1/i)
    expect(option1).toBeInTheDocument()

    await userEvent.click(option1);
    expect(mockAction).toHaveBeenCalledTimes(1);

    const subOption = screen.getByText(/Sub-Option 1-2-1/i)
    expect(subOption).toBeInTheDocument()
   
  })
})
