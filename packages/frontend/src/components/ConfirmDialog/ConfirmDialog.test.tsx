import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './ConfirmDialog.stories' // Ensure correct path

const composed = composeStories(stories)

describe('ConfirmDialog', () => {
  test('calls onConfirm when confirm button is clicked', async () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    render(<composed.Default onConfirm={handleConfirm} onClose={handleClose} />)

    const title = screen.getByText('Delete Category')
    expect(title).toBeInTheDocument()

    const paragraph = screen.getByText(/are you sure you want to delete the category/i)
    expect(paragraph).toBeInTheDocument()

    const confirmButton = screen.getByRole('button', { name: /Remove Category/i })
    await userEvent.click(confirmButton)
    expect(handleConfirm).toHaveBeenCalledTimes(1)

    const closeButton = screen.getByRole('button', { name: /Cancel/i })
    await userEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
