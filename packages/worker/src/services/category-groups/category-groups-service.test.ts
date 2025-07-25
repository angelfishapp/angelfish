/**
 * Tests for all the CategoryGroupService Methods
 */

import { mockRegisterTypedAppCommand } from '@angelfish/tests'

import type { ICategoryGroup } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'

import { CategoryGroupsService } from '.'

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
  mockRegisterTypedAppCommand(AppCommandIds.LIST_ACCOUNTS, async () => {
    return []
  })
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

describe('CategoryGroupService', () => {
  test('test list-category-groups', async () => {
    // Test Getting all Category Groups in DB
    const response = await CategoryGroupsService.listCategoryGroups()
    expect(response.length).toEqual(21)
  })

  test('test save-category-group', async () => {
    // Create new category and get it to ensure its saved into DB
    const categoryGroup = {
      name: 'Test Category Group',
      type: 'Income',
      icon: 'home',
      description: 'This is a description',
      color: '#FFFFFF',
    } as ICategoryGroup

    let response = await CategoryGroupsService.saveCategoryGroup(categoryGroup)
    expect(response.id).toBeDefined()
    expect(response.name).toBe('Test Category Group')

    // Update the new category
    response.name = 'Test Category Group 2'
    response = await CategoryGroupsService.saveCategoryGroup(response)
    expect(response.name).toBe('Test Category Group 2')
  })

  test('test get-category-group', async () => {
    // Test getting category in DB with id=1
    const response = await CategoryGroupsService.getCategoryGroup({ id: 1 })
    expect(response?.name).toBe('Bank Charges')
    expect(response?.total_categories).toBe(2)
  })

  test('test delete-category', async () => {
    // Delete Category Group created in last test with id 22
    await CategoryGroupsService.deleteCategoryGroup({ id: 22 })

    // Try getting the Category Group, should be null
    const getResponse = await CategoryGroupsService.getCategoryGroup({ id: 22 })
    expect(getResponse).toBeNull()
  })
})
