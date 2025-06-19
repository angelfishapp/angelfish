import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true, // Allows using `describe`, `it`, etc. without importing
    environment: 'jsdom', // Use JSDom environment
    setupFiles: ['./tests/setup.tsx'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
    testTimeout: 10000,
  },
})
