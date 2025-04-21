import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './CategoryLabel.stories' // Ensure correct path

const composed = composeStories(stories)

describe('CategoryLabel', () => {
  test('renders Category story', () => {
    const { container } = render(<composed.Category />)
    const span = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(span).toBeInTheDocument()
    expect(span).toHaveStyle({ backgroundSize: '6100% 6100%' })
    const [text] = screen.getAllByText('Groceries')
    expect(text).toBeInTheDocument()
  })
  test('renders Transfer story', () => {
    render(<composed.Transfer />)
    const fallbackIcon = screen.getByTestId('AccountBalanceIcon')
    expect(fallbackIcon).toBeInTheDocument()
    const [text] = screen.getAllByText('Credit Card')
    expect(text).toBeInTheDocument()
  })
  test('renders Unclassified story', () => {
    render(<composed.Unclassified />)
    const [text] = screen.getAllByText('Unclassified')
    expect(text).toBeInTheDocument()
  })
})
