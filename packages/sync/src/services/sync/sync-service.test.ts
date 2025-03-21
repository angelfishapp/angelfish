/**
 * Tests for all the SyncService Methods
 */

import { AppCommandIds } from '@angelfish/core'
import { mockRegisterTypedAppCommand } from '@angelfish/tests'

import { SyncService } from '.'

/**
 * Initialise mock App Commands for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, async () => {})
})

/**
 * Tests
 */

describe('SyncService', () => {
  test('test sync', async () => {
    // Test Getting all Tags in DB
    const syncSunmary = await SyncService.sync()
    expect(syncSunmary).toBeDefined()
  })
})
