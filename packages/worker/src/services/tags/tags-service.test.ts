/**
 * Tests for all the TagService Methods
 */

import type { ITagUpdate } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'

import { TagService } from '.'

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

describe('TagService', () => {
  test('test save-tag', async () => {
    // Create new Tag and get it to ensure its saved into DB
    const tag = {
      name: 'Test Tag',
    } as ITagUpdate

    const response = await TagService.saveTag(tag)
    expect(response.name).toBe('Test Tag')
    expect(response.id).toBeDefined()
    expect(response.created_on).toBeDefined()
    expect(response.modified_on).toBeDefined()

    const getResponse = await TagService.getTag({ id: response.id })
    expect(getResponse).toBeDefined()
    expect(getResponse?.name).toBe('Test Tag')

    // Update the new Tag
    response.name = 'Test Tag 2'
    const updateResponse = await TagService.saveTag(response)
    expect(updateResponse.name).toBe('Test Tag 2')
  })

  test('test list-tags', async () => {
    // Test Getting all Tags in DB
    const response = await TagService.listTags()
    expect(response.length).toEqual(1)
  })

  test('test get-tag', async () => {
    // Test getting Tag in DB with id=1
    const response = await TagService.getTag({ id: 1 })
    expect(response).toBeDefined()
    expect(response?.name).toBe('Test Tag 2')
  })

  test('test delete-tag', async () => {
    // Delete Tag created in last test with id 1
    await TagService.deleteTag({ id: 1 })

    // Try getting the Tag, should be null
    const getResponse = await TagService.getTag({ id: 1 })
    expect(getResponse).toBeNull()
  })
})
