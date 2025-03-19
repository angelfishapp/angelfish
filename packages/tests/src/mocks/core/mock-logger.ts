import { TestLogger } from '../../utils/index.js'

/**
 * Mock @angelfish/core Logger before any test runs so we don't get 'window' is not defined
 * errors when running tests in Node.js.
 */
export class MockLogger {
  private scope: string

  private constructor(scope: string) {
    this.scope = scope
  }

  static scope(scope: string) {
    return new MockLogger(scope)
  }

  public error(...args: any[]) {
    TestLogger.error(`[ERROR] (${this.scope})`, ...args)
  }
  public warn(...args: any[]) {
    TestLogger.warn(`[WARN] (${this.scope})`, ...args)
  }
  public info(...args: any[]) {
    TestLogger.info(`[INFO] (${this.scope})`, ...args)
  }
  public verbose(...args: any[]) {
    TestLogger.log(`[VERBOSE] (${this.scope})`, ...args)
  }
  public debug(...args: any[]) {
    TestLogger.debug(`[DEBUG] (${this.scope})`, ...args)
  }
  public silly(...args: any[]) {
    TestLogger.log(`[SILLY] (${this.scope})`, ...args)
  }
}
