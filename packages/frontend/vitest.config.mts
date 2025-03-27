import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Allows using `describe`, `it`, etc. without importing
    environment: 'jsdom', // Use JSDom environment
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
})
