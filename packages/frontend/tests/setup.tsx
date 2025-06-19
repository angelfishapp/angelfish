import { ThemeProvider } from '@mui/system'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

import theme from '../src/app/theme'

/**
 * Put mocks used across multiple tests here
 */

class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
globalThis.ResizeObserver = ResizeObserver

globalThis.Path2D = class {
  constructor() {}
  addPath = vi.fn()
} as any

vi.mock('lottie-web', async (importOriginal) => {
  // eslint-disable-next-line
  const actual = await importOriginal<typeof import('lottie-web')>()

  return {
    ...actual, // Preserve other exports
    loadAnimation: () => ({
      play: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
    }),
  }
})

/**
 * Configure Test Providers here that apply to all tests
 */

const TestProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

// Wrap every render with your providers
vi.mock('@testing-library/react', async (importOriginal) => {
  // eslint-disable-next-line
  const actual = await importOriginal<typeof import('@testing-library/react')>()

  return {
    ...actual,
    render: (ui: React.ReactElement, options?: Parameters<typeof actual.render>[1]) =>
      actual.render(ui, {
        wrapper: TestProviders,
        ...options,
      }),
  }
})
