/**
 * Tests for all the CloudService Methods
 */

import { AppCommandIds, AppEventIds, CommandsClient } from '@angelfish/core'
import { mockRegisterTypedAppCommand, TestLogger } from '@angelfish/tests'

import { CloudService } from '.'

/**
 * Initialise mock App Commands for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, async () => {})
  CommandsClient.addAppEventListener(AppEventIds.ON_ONLINE_STATUS_CHANGED, (status) => {
    TestLogger.info(AppEventIds.ON_ONLINE_STATUS_CHANGED, status)
  })

  // Mock browser navigator to simulate online/offline status. This will only be called if
  // computer is offline so will always return false for the tests
  // See cloud-error-decorator.ts for more details
  if (!globalThis.navigator) {
    // Define the whole navigator object
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      configurable: true,
    })
  }
  // Then define the `onLine` property
  Object.defineProperty(globalThis.navigator, 'onLine', {
    value: false,
    configurable: true,
  })
})

/**
 * Tests
 */

describe('CloudService', () => {
  // Hold reference to session ID
  let session_id: string = ''

  test('test send OOB Code', async () => {
    TestLogger.info(`Testing sendOOBCode with email ${process.env.TEST_EMAIL}`)
    session_id = await CloudService.sendOOBCode({ email: process.env.TEST_EMAIL as string })
    expect(session_id).toBeDefined()
  })

  test('test authentication', async () => {
    TestLogger.info(
      `Testing sendOOBCode with session Id ${session_id} and oob_code ${process.env.TEST_OOB_CODE}`,
    )
    const tokens = await CloudService.authenticate({
      session_id,
      oob_code: process.env.TEST_OOB_CODE as string,
    })
    expect(tokens.refresh_token).toBeDefined()
    expect(tokens.token).toBeDefined()

    CloudService.initialiseAPIClient({ refreshToken: tokens.refresh_token })
  })

  test('test logout', async () => {
    await CloudService.logout()
  })
})
