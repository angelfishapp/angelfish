import fs from 'fs'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Allows using `describe`, `it`, etc. without importing
    environment: 'node', // Use Node.js environment
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
  plugins: [
    swc.vite(),
    {
      name: 'yaml-loader',
      transform(src, id) {
        if (id.endsWith('.yaml') || id.endsWith('.yml')) {
          const yamlContent = fs.readFileSync(id, 'utf8')
          return `export default "${yamlContent}"};`
        }
      },
    },
  ],
})
