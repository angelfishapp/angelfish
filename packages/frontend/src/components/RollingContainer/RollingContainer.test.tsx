import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './RollingContainer.stories'

const { Default } = composeStories(stories)
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

describe('RollingContainer', () => {
  it('renders the content inside the scroll container', () => {
    render(<Default />)
    expect(screen.getByText(/This is the content/i)).toBeInTheDocument()
  })

  it('removes "atEnd" when content is scrolled horizontally', async () => {
    render(<Default />)

    const scrollable = document.querySelector('.scrollbar') as HTMLDivElement

    expect(scrollable.classList.contains('atStart')).toBe(false)
    expect(scrollable.classList.contains('atEnd')).toBe(false)
  })
})
