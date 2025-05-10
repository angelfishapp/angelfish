/**
 * Tests for all the InstitutionService Methods
 */

import type { IInstitutionUpdate } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'

import { InstitutionService } from '.'

/**
 * Initialise in-memory SQLIte Database and authenticated API for use during tests
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

describe('InstitutionService', () => {
  test('test save-institution', async () => {
    // Create new Institution and get it to ensure its saved into DB
    const institution = {
      name: 'Test Institution',
      country: 'US',
    } as IInstitutionUpdate

    const response = await InstitutionService.saveInstitution(institution)
    expect(response).toBeDefined()
    expect(response.name).toBe('Test Institution')
    expect(response.id).toBeDefined()
    expect(response.created_on).toBeDefined()
    expect(response.modified_on).toBeDefined()

    const getResponse = await InstitutionService.getInstitution({ id: response.id })
    expect(getResponse).toBeDefined()
    expect(getResponse?.name).toBe('Test Institution')

    // Update the new Institution
    response.name = 'Test Institution 2'
    const updateResponse = await InstitutionService.saveInstitution(response)
    expect(updateResponse.name).toBe('Test Institution 2')
  })

  test('test list-institutions', async () => {
    // Test Getting all Institutions in DB
    const response = await InstitutionService.listInstitutions()
    expect(response.length).toEqual(1)
  })

  test('test get-institution', async () => {
    // Test getting Institution in DB with id=1
    const response = await InstitutionService.getInstitution({ id: 1 })
    expect(response?.name).toBe('Test Institution 2')
  })

  test('test delete-institution', async () => {
    await InstitutionService.deleteInstitution({ id: 1 })

    // Try getting the Institution, should be null
    const getResponse = await InstitutionService.getInstitution({ id: 1 })
    expect(getResponse).toBeNull()
  })
})
