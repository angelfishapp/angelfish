import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as TableStories from './TransactionsTable.stories'

const { Default, EmptyTable, LongTable } = composeStories(TableStories)

describe('Table component stories', () => {
  it('renders Default table with data', async () => {
    render(<Default />)
    expect(await screen.findByText('Tags')).toBeInTheDocument()
  })

  it('renders EmptyTable with no data', async () => {
    render(<EmptyTable />)

    expect(await screen.findByText('Tags')).toBeInTheDocument()
    expect(screen.queryByText('No Transaction Data')).toBeInTheDocument()
  })

  it('renders LongTable with simple test ', async () => {
    render(<LongTable />)
    expect(await screen.findByText('Tags')).toBeInTheDocument()
  })
})
