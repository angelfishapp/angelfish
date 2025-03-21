/**
 * Tests for all the CloudService Methods
 */

import { AppCommandIds } from '@angelfish/core'
import { mockRegisterTypedAppCommand } from '@angelfish/tests'

import { CloudService } from '.'

/**
 * Initialise mock App Commands for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, async () => {})
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
