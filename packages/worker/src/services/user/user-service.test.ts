/**
 * Tests for all the UserService Methods
 */

import { AppCommandIds } from '@angelfish/core'
import { authenticatedUser, mockRegisterTypedAppCommand, users } from '@angelfish/tests'
import { DatabaseManager } from '../../database/database-manager'

import { UserService } from '.'

/**
 * Initialise in-memory SQLIte Database and authenticated API for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  mockRegisterTypedAppCommand(AppCommandIds.GET_AUTHETICATED_USER, async () => authenticatedUser)
})

/**
 * Make sure we close Database connection at end of tests
 */
afterAll(async () => {
  await DatabaseManager.close()
})

/**
 * Tests
 */

describe('UserService', () => {
  test('test save-user', async () => {
    const newUser = await UserService.saveUser(users[0])
    expect(newUser).toBeDefined()
    expect(newUser.id).toEqual(1)
    expect(newUser.email).toEqual('john@test.com')

    const newUser2 = await UserService.saveUser(users[1])
    expect(newUser2).toBeDefined()
    expect(newUser2.id).toEqual(2)
    expect(newUser2.email).toEqual('sophia@test.com')
  })

  test('test get-user', async () => {
    // Test Getting User by id
    const user = await UserService.getUser({ id: 1 })
    expect(user).toBeDefined()
    expect(user?.id).toEqual(1)
    expect(user?.email).toEqual('john@test.com')

    // Test Getting User by cloud_id
    const cloudUser = await UserService.getUser({ cloud_id: authenticatedUser.id })
    expect(cloudUser).toBeDefined()
    expect(cloudUser?.id).toEqual(1)
    expect(cloudUser?.email).toEqual('john@test.com')
  })

  test('test list-users', async () => {
    // Test Getting all Users in DB
    const response = await UserService.listUsers()
    expect(response.length).toEqual(2)
  })

  test('test delete-user', async () => {
    // Test Deleting Fake User ID throws error
    await expect(async () => {
      await UserService.deleteUser({ id: 999 })
    }).rejects.toThrow('User with ID 999 does not exist')

    // Test deleting current user throws error
    await expect(async () => {
      await UserService.deleteUser({ id: 1 })
    }).rejects.toThrow('Cannot delete Authenticated User')

    // Test Deleting User from DB
    await UserService.deleteUser({ id: 2 })
    const response = await UserService.getUser({ id: 2 })
    expect(response).toBeNull()
  })
})
