import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './FinancialFreedomProgressBar.stories'

const { Default } = composeStories(stories)

describe('FinancialFreedomProgressBar', () => {
  it('renders the Default story correctly', () => {
    const { container } = render(<Default />)

    // Check if the title is rendered
    expect(screen.getByText('Financial Freedom Index')).toBeInTheDocument()

    // Check if the description is rendered
    expect(
      screen.getByText(/Based on your average Income & Expenses for the past/i),
    ).toBeInTheDocument()

    // Check if the progress bar is rendered
    expect(container.querySelector('.css-lj2apr')).toBeInTheDocument()

    // Check if the passive income tooltip is rendered
    expect(screen.getByText('PASSIVE INCOME')).toBeInTheDocument()

    // Check if the critical expenses tooltip is rendered
    expect(screen.getByText('CRITICAL EXPENSES')).toBeInTheDocument()

    // Check if the important expenses tooltip is rendered
    expect(screen.getByText('IMPORTANT EXPENSES')).toBeInTheDocument()

    // Check if the total expenses tooltip is rendered
    expect(screen.getByText('TOTAL EXPENSES')).toBeInTheDocument()
  })
})
