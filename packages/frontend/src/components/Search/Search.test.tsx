import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './Search.stories'

const { Default } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const searchInput = screen.getByPlaceholderText('Search...')
    expect(searchInput).toBeInTheDocument()
    const searchIcon = screen.getByTestId(/SearchIcon/i)
    expect(searchIcon).toBeInTheDocument()
  })
})
