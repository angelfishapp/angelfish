/**
 * Tests for all the AuthService Methods
 */

import type { IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, AppEventIds, CommandsClient, registerCommands } from '@angelfish/core'
import { mockRegisterTypedAppCommand, TestLogger } from '@angelfish/tests'
import { MockCloudService } from '../../../tests/mock-cloud-service'

import { AuthService } from '.'

const authenticatedState: {
  authenticatedUser: IAuthenticatedUser | null
  refreshToken: string | null
} = {
  authenticatedUser: null,
  refreshToken: null,
}

/**
 * Initialise mock App Commands for use during tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, async (authSettings) => {
    if (authSettings.authenticatedUser !== undefined) {
      authenticatedState.authenticatedUser = authSettings.authenticatedUser
    }
    if (authSettings.refreshToken !== undefined) {
      authenticatedState.refreshToken = authSettings.refreshToken
    }
    TestLogger.info(AppCommandIds.SET_AUTHENTICATION_SETTINGS, authenticatedState)
  })
  mockRegisterTypedAppCommand(AppCommandIds.GET_AUTHENTICATION_SETTINGS, async () => {
    TestLogger.info(AppCommandIds.GET_AUTHENTICATION_SETTINGS, authenticatedState)
    return authenticatedState
  })
  mockRegisterTypedAppCommand(AppCommandIds.GET_USER, async (query) => {
    TestLogger.info(AppCommandIds.GET_USER, query)
    return null
  })
  // Depends on CloudService Commands to make requests to Cloud API
  registerCommands([MockCloudService])
  // Register AuthService Event Listeners to handle authentication events
  CommandsClient.addAppEventListener(AppEventIds.ON_LOGIN, (event) => {
    TestLogger.info(AppEventIds.ON_LOGIN, event)
  })
  CommandsClient.addAppEventListener(AppEventIds.ON_LOGOUT, () => {
    TestLogger.info(AppEventIds.ON_LOGOUT)
  })
})

/**
 * Tests
 */

describe('AuthService', () => {
  test('test authentication', async () => {
    await AuthService.sendOOBCode({ email: 'john@test.com' })
    await AuthService.authenticate({ oob_code: '123456' })
  })

  test('test Get Authentication User', async () => {
    const userProfile = await AuthService.getAuthenticatedUser()
    expect(userProfile).toBeDefined()
    expect(userProfile?.id).toEqual(authenticatedState.authenticatedUser?.id)
  })

  test('test Update Authentication User', async () => {
    const randomPhone = `+${Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')}`
    TestLogger.debug(`Updating authenticated user phone to ${randomPhone}`)
    const updatedAuthenticatedUser = await AuthService.updateAuthenticatedUser({
      phone: randomPhone,
    })
    expect(updatedAuthenticatedUser).toBeDefined()
    expect(updatedAuthenticatedUser.id).toEqual(authenticatedState.authenticatedUser?.id)
    expect(updatedAuthenticatedUser.phone).toEqual(randomPhone)
  })

  test('test logout', async () => {
    await AuthService.logout()
    const userProfile = await AuthService.getAuthenticatedUser()
    expect(userProfile).toBeNull()
  })
})
