import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

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
