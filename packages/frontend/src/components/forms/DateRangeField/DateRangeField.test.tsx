import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import moment from 'moment'
import * as stories from './DateRangeField.stories'

const { Default, SelectField } = composeStories(stories)

describe('renders Date Field Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const [title] = screen.getAllByText(/Date Range Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Select Date Range...') as HTMLInputElement
    expect(input).toBeInTheDocument()
    fireEvent.click(input)
    const todayButton = screen.getByText(/Last 24 Hours/i)
    expect(todayButton).toBeInTheDocument()
    fireEvent.click(todayButton)

    const todayFormatted = moment().format('MM/DD/YYYY')
    const yesterdayFormatted = moment().subtract(1, 'day').format('MM/DD/YYYY')

    expect(input.value).toBe(`${yesterdayFormatted} - ${todayFormatted}`)
  })
  test('render of default Story', async () => {
    render(<SelectField />)

    const icon = screen.getByTestId(/ExpandMoreIcon/i)
    expect(icon).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Select Date Range...') as HTMLInputElement
    expect(input).toBeInTheDocument()
    fireEvent.click(input)

    const todayButton = screen.getByText(/Last 24 Hours/i)
    expect(todayButton).toBeInTheDocument()
    fireEvent.click(todayButton)

    expect(input.value).toBe('Last 24 Hours')
  })
})
