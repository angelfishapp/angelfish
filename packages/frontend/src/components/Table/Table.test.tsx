import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as TableStories from './Table.stories'

const {
  Default,
  Virtualized,
  VirtualizedWithFilterBar,
  EmptyTable,
  CustomFooter,
  WithColumnPinning,
  WithRowSelection,
  WithColumnResizing,
  WithIDHidden,
  WithGrouping,
} = composeStories(TableStories)

describe('Table component stories', () => {
  it('renders Default table with data', async () => {
    render(<Default />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
  })

  it('renders Virtualized table', async () => {
    render(<Virtualized />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
  })

  it('renders VirtualizedWithFilterBar with filter input', async () => {
    render(<VirtualizedWithFilterBar />)
    expect(await screen.findByPlaceholderText('Filter by title')).toBeInTheDocument()
  })

  it('renders EmptyTable with no data', () => {
    render(<EmptyTable />)
    expect(screen.queryByText('No Data')).toBeInTheDocument()
  })

  it('renders CustomFooter with custom content', async () => {
    render(<CustomFooter />)
    expect(await screen.findByText('Custom Footer')).toBeInTheDocument()
  })

  it('renders WithColumnPinning with visible pinned columns', async () => {
    render(<WithColumnPinning />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
  })

  it('renders WithRowSelection and displays selectable rows', async () => {
    render(<WithRowSelection />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
  })

  it('renders WithColumnResizing with resizable columns', async () => {
    render(<WithColumnResizing />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
  })

  it('renders WithIDHidden and hides the ID column', async () => {
    render(<WithIDHidden />)
    expect(await screen.findByText('Title')).toBeInTheDocument()
    expect(screen.queryByText('ID')).not.toBeInTheDocument()
  })

  it('renders WithGrouping and groups rows by currency and date', async () => {
    render(<WithGrouping />)
    await waitFor(() => {
      expect(screen.getAllByText(/GBP/)[0]).toBeInTheDocument()
    })
  })
})
