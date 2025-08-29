import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import * as stories from './Tabs.stories'

const { Default } = composeStories(stories)

describe('Tabs Component', () => {
  test('renders of default Story', async () => {
    render(<Default />)

    const mainContentText = screen.getByText(/Tab 1 Label/i)
    expect(mainContentText).toBeInTheDocument()
    const seconderyContentText = screen.getByText(/Content for Tab 1/i)
    expect(seconderyContentText).toBeInTheDocument()
  })
})
