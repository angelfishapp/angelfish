import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './Drawer.stories'

const { Right, RightWithSaveButton, Bottom } = composeStories(stories)

describe('Drawer stories', () => {
  it('renders the Right drawer', async () => {
    render(<Right />)
    await waitFor(() => {
      const paper = document.querySelector('.MuiDrawer-paper')
      expect(paper).toHaveClass('MuiDrawer-paperAnchorRight')
      expect(screen.getByText('Edit Drawer')).toBeInTheDocument()
      const moreIconButton = screen.getByTestId('MoreHorizIcon')
      fireEvent.click(moreIconButton)
      expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
    })
  })

  it('renders RightWithSaveButton and triggers onSave', async () => {
    const user = userEvent.setup()
    render(<RightWithSaveButton />)
    await waitFor(() => {
      const paper = document.querySelector('.MuiDrawer-paper')
      expect(paper).toHaveClass('MuiDrawer-paperAnchorRight')
      const saveButton = screen.getByRole('button', { name: /save/i })
      user.click(saveButton)

      expect(saveButton).toBeInTheDocument()

      const moreIconButton = screen.getByTestId('MoreHorizIcon')
      fireEvent.click(moreIconButton)

      expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
    })
  })

  it('renders the Bottom drawer with Delete menu item', async () => {
    render(<Bottom />)
    await waitFor(() => {
      const paper = document.querySelector('.MuiDrawer-paper')
      expect(paper).toHaveClass('MuiDrawer-paperAnchorBottom')
      expect(screen.getByText('Edit Drawer')).toBeInTheDocument()

      const moreIconButton = screen.getByTestId('MoreHorizIcon')
      fireEvent.click(moreIconButton)
      expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
    })
  })
})
