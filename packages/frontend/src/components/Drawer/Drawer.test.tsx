import { createTheme, ThemeProvider } from '@mui/material'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './Drawer.stories'

const { Right, RightWithSaveButton, Bottom } = composeStories(stories)

const mockTheme = createTheme({
  custom: {
    side: {
      width: 240, // or whatever value you use
    },
  },
})
describe('Drawer stories', () => {
  it('renders the Right drawer', () => {
    render(<Right />)
    const paper = document.querySelector('.MuiDrawer-paper')
    expect(paper).toHaveClass('MuiDrawer-paperAnchorRight')
    expect(screen.getByText('Edit Drawer')).toBeInTheDocument()
    const moreIconButton = screen.getByTestId('MoreHorizIcon')
    fireEvent.click(moreIconButton)
    expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
  })

  it('renders RightWithSaveButton and triggers onSave', async () => {
    const user = userEvent.setup()
    render(<RightWithSaveButton />)

    const paper = document.querySelector('.MuiDrawer-paper')
    expect(paper).toHaveClass('MuiDrawer-paperAnchorRight')
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    expect(saveButton).toBeInTheDocument()

    const moreIconButton = screen.getByTestId('MoreHorizIcon')
    fireEvent.click(moreIconButton)
    expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
  })

  it('renders the Bottom drawer with Delete menu item', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Bottom />
      </ThemeProvider>,
    )
    const paper = document.querySelector('.MuiDrawer-paper')
    expect(paper).toHaveClass('MuiDrawer-paperAnchorBottom')
    expect(screen.getByText('Edit Drawer')).toBeInTheDocument()

    const moreIconButton = screen.getByTestId('MoreHorizIcon')
    fireEvent.click(moreIconButton)
    expect(screen.getByText(/Delete Item/i)).toBeInTheDocument()
  })
})
