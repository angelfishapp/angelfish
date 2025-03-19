import os from 'os'
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
      isTest: true,
      isProduction: false,
      platform: 'linux',
      processId: 'worker',
      logsDir: os.tmpdir(),
      userDataDir: os.tmpdir(),
      logLevel: 'debug',
      toObject: () => ({
        environment: 'test',
        isDev: false,
        isTest: true,
        isProduction: false,
        platform: 'linux',
        processId: 'worker',
        logsDir: os.tmpdir(),
        userDataDir: os.tmpdir(),
        logLevel: 'debug',
      }),
    },
    CommandsClient: {
      registerCommand: vi.fn(),
      executeCommand: vi.fn(),
      executeAppCommand: vi.fn(),
      emitEvent: vi.fn(),
      emitAppEvent: vi.fn(),
      addEventListener: vi.fn(),
      addAppEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      listCommands: vi.fn(),
      listChannels: vi.fn(),
    },
  }
})
