import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './DateRangePicker.stories'

const composed = composeStories(stories)

describe('DateRangePicker', () => {
  test('renders the Default story with date ranges', () => {
    render(<composed.Default />)

    expect(screen.getByText(/Last 24 Hours/i)).toBeInTheDocument()
    expect(screen.getByText(/Last 7 days/i)).toBeInTheDocument()
    expect(screen.getByText(/This Month/i)).toBeInTheDocument()
    expect(screen.getByText(/Last Month/i)).toBeInTheDocument()
    expect(screen.getByText(/Last Year/i)).toBeInTheDocument()
    expect(screen.getByText(/This Year/i)).toBeInTheDocument()
  })

  test('calls onSelect when a date range is clicked', async () => {
    const handleSelect = vi.fn()
    userEvent.setup()
    render(
      <composed.Default dateRanges={composed.Default.args.dateRanges} onSelect={handleSelect} />,
    )

    const button = screen.getByText(/Last 24 Hours/i)
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(handleSelect).toHaveBeenCalled()
  })

  test('renders WithValue story and shows selected range', () => {
    render(<composed.WithValue />)
    expect(screen.getByText('This Year')).toBeInTheDocument()
  })
})
