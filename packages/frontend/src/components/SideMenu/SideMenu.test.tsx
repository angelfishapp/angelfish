import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './SideMenu.stories'

const { Default } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const mainContentText = screen.getByText(/Main Content Here/i)
    expect(mainContentText).toBeInTheDocument()
    const seconderyContentText = screen.getByText(/Menu item 1/i)
    expect(seconderyContentText).toBeInTheDocument()
  })
})
