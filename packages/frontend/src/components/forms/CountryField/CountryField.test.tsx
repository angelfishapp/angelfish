import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CountryField.stories'

const { Default } = composeStories(stories)

describe('renders CountryField Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const [title] = screen.getAllByText(/Country Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Search Countries...') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const helperText = screen.getByText(/Select a country from the list/i)
    expect(helperText).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'canada' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(input.value).toBe('Canada')
  })
})
