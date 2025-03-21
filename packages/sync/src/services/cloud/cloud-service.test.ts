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
    // Test Getting all Tags in DB
    session_id = await CloudService.sendOOBCode({ email: 'test@angelfish.app' })
    expect(session_id).toBeDefined()
  })
})
