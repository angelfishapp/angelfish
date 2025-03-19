/**
 * Tests for all the CategoryGroupService Methods
 */

import type { ICategoryGroup } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'

import { CategoryGroupService } from '.'

/**
 * Initialise in-memory SQLIte Database for use during tests
 */
beforeAll(async () => {
  await DatabaseManager.initConnection(':memory:')
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
    const response = await CategoryGroupService.listCategoryGroups()
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

    let response = await CategoryGroupService.saveCategoryGroup(categoryGroup)
    expect(response.id).toBeDefined()
    expect(response.name).toBe('Test Category Group')

    // Update the new category
    response.name = 'Test Category Group 2'
    response = await CategoryGroupService.saveCategoryGroup(response)
    expect(response.name).toBe('Test Category Group 2')
  })

  test('test get-category-group', async () => {
    // Test getting category in DB with id=1
    const response = await CategoryGroupService.getCategoryGroup({ id: 1 })
    expect(response?.name).toBe('Bank Charges')
    expect(response?.total_categories).toBe(2)
  })

  test('test delete-category', async () => {
    // Delete Category Group created in last test with id 22
    await CategoryGroupService.deleteCategoryGroup({ id: 22 })

    // Try getting the Category Group, should be null
    const getResponse = await CategoryGroupService.getCategoryGroup({ id: 22 })
    expect(getResponse).toBeNull()
  })
})
