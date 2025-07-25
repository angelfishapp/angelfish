import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import moment from 'moment'
import * as stories from './DateField.stories'

const { Default } = composeStories(stories)

describe('renders Date Field Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const [title] = screen.getAllByText(/Date Field/i)
    expect(title).toBeInTheDocument()

    const input = document.getElementById('data-picker-field') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const todayFormatted = moment().utc().format('MM/DD/YYYY')
    expect(input.value).toBe(todayFormatted)
  })
})
