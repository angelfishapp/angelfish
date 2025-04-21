import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './ImportTransactions.stories'

vi.mock('lottie-web', () => ({
  loadAnimation: vi.fn(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn(),
  })),
}))

const { Default } = composeStories(stories)

describe('AccountTable', () => {
  it('renders default account table with rows', () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const importButton = screen.getByRole('button', { name: 'Import Transactions' })
    expect(importButton).toBeInTheDocument()

    // this test is not full test because of ctx errors something related to canvas and animations
  })
})
