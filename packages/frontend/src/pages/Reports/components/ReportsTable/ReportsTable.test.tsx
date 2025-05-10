import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './ReportsTable.stories'

const { Default } = composeStories(stories)

describe('ReportsTable', () => {
  it('renders income and expense tables correctly', () => {
    render(<Default />)

    expect(screen.getByText('Income')).toBeInTheDocument()

    expect(screen.getByText('Income Total')).toBeInTheDocument()

    expect(screen.getByText('Expenses')).toBeInTheDocument()

    expect(screen.getByText('NET')).toBeInTheDocument()

    expect(screen.getByText('Expenses Total')).toBeInTheDocument()
  })
})
