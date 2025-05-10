/* eslint-disable no-console */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { composeStories } from '@storybook/react'
import type { RenderOptions } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import * as TableStories from './TransactionsTable.stories'

const emotionCache = createCache({ key: 'css', prepend: true })
console.error = () => {
  return
}

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
