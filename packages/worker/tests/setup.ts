import 'reflect-metadata'
import { vi } from 'vitest'

// Mock @angelfish/core Environment & CommandRegistry before any test runs
vi.mock('@angelfish/core', async (importOriginal) => {
  // eslint-disable-next-line
  const actual = await importOriginal<typeof import('@angelfish/core')>()

  return {
    ...actual, // Preserve other exports
    Environment: {
      environment: 'test',
      isDev: false,
      platform: 'linux',
      processId: 'worker',
      logsDir: '/tmp',
      userDataDir: '/tmp',
      logLevel: 'debug',
      toObject: () => ({
        environment: 'test',
        isDev: false,
        platform: 'linux',
        processId: 'worker',
        logsDir: '/tmp',
        userDataDir: '/tmp',
        logLevel: 'debug',
      }),
    },
    CommandsClient: {
      registerCommand: vi.fn(),
      executeCommand: vi.fn(),
      emitEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      listCommands: vi.fn(),
      listChannels: vi.fn(),
    },
  }
})
