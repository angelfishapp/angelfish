import os from 'os'

/**
 * Mock @angelfish/core Environment before any test runs so we don't get 'window' is not defined
 * errors when running tests in Node.js.
 */
export const MockEnvironment = {
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
}
