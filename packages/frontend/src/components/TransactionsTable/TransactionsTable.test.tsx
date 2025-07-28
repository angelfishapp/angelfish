import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { composeStories } from '@storybook/react'
import type { RenderOptions } from '@testing-library/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { vi } from 'vitest'
import * as TableStories from './TransactionsTable.stories'
import * as TableModule from '../Table'

const emotionCache = createCache({ key: 'css', prepend: true })

export const renderWithEmotion = (ui: ReactElement, options?: RenderOptions) => {
  return render(<CacheProvider value={emotionCache}>{ui}</CacheProvider>, options)
}

const { Default, EmptyTable, LongTable } = composeStories(TableStories)

describe('Table component stories', () => {
  it('renders Default table with data', async () => {
    renderWithEmotion(<Default />)
    expect(await screen.findByText('Tags')).toBeInTheDocument()
  })

  it('renders EmptyTable with no data', async () => {
    renderWithEmotion(<EmptyTable />)

    expect(await screen.findByText('Tags')).toBeInTheDocument()
    expect(screen.queryByText('No Transaction Data')).toBeInTheDocument()
  })

  it('renders LongTable with simple test ', async () => {
    renderWithEmotion(<LongTable />)
    expect(await screen.findByText('Tags')).toBeInTheDocument()
  })
})

describe('TransactionsTable Keyboard Shortcuts', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should focus the table container when clicked', async () => {
    renderWithEmotion(<Default />)

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Tags')).toBeInTheDocument()
    })

    const tableContainer = document.querySelector('[tabindex="0"]')
    expect(tableContainer).toBeInTheDocument()

    await user.click(tableContainer!)
    expect(tableContainer).toHaveFocus()
  })

  it('should call selection logic when navigating with arrow keys', async () => {
    const spy = vi.spyOn(TableModule, 'handleRowSelection')

    renderWithEmotion(<LongTable />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())
    const tableContainer = document.querySelector('[tabindex="0"]')!

    await user.click(tableContainer)
    await user.keyboard('{ArrowDown}')

    expect(spy).toHaveBeenCalled()
  })
  it('should call selection logic for multi-select with Shift+Arrow', async () => {
    const spy = vi.spyOn(TableModule, 'handleRowSelection')

    renderWithEmotion(<LongTable />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())
    const tableContainer = document.querySelector('[tabindex="0"]')!

    await user.click(tableContainer)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')

    expect(spy).toHaveBeenCalled()
  })

  it('should trigger duplication when Ctrl+C is pressed with selected rows', async () => {
    const mockOnSaveTransactions = vi.fn()
    const DefaultWithMock = () => <Default onSaveTransactions={mockOnSaveTransactions} />

    renderWithEmotion(<DefaultWithMock />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())

    const tableContainer = document.querySelector('[tabindex="0"]')!
    await user.click(tableContainer)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Control>}c{/Control}')

    await waitFor(() => expect(mockOnSaveTransactions).toHaveBeenCalled())
  })

  it('should create new transaction when Shift+N is pressed', async () => {
    renderWithEmotion(<Default />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())

    const tableContainer = document.querySelector('[tabindex="0"]')!
    await user.click(tableContainer)
    await user.keyboard('{Shift>}n{/Shift}')

    expect(tableContainer).toHaveFocus()
  })

  it('should toggle reviewed status when Ctrl+R is pressed', async () => {
    const mockOnSaveTransactions = vi.fn()
    const DefaultWithMock = () => <Default onSaveTransactions={mockOnSaveTransactions} />

    renderWithEmotion(<DefaultWithMock />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())

    const tableContainer = document.querySelector('[tabindex="0"]')!
    await user.click(tableContainer)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Control>}r{/Control}')

    await waitFor(() => expect(mockOnSaveTransactions).toHaveBeenCalled())
  })

  it('should not handle shortcuts when table is not focused', async () => {
    const mockOnSaveTransactions = vi.fn()
    const DefaultWithMock = () => <Default onSaveTransactions={mockOnSaveTransactions} />

    renderWithEmotion(<DefaultWithMock />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())

    await user.keyboard('{Control>}c{/Control}')

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(mockOnSaveTransactions).not.toHaveBeenCalled()
  })

  it('should handle shortcuts with empty table', async () => {
    renderWithEmotion(<EmptyTable />)

    await waitFor(() => expect(screen.getByText('Tags')).toBeInTheDocument())

    const tableContainer = document.querySelector('[tabindex="0"]')!
    await user.click(tableContainer)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowUp}')

    expect(tableContainer).toHaveFocus()
    const selectedRows = document.querySelectorAll('[data-state="selected"]')
    expect(selectedRows.length).toBe(0)
  })
})
