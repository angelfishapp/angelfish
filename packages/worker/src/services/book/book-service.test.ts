/**
 * Tests for all the BookService Methods
 */

import { AppCommandIds, registerCommands } from '@angelfish/core'
import { authenticatedUser, mockRegisterTypedAppCommand } from '@angelfish/tests'
import { UserService } from '../user'

import { BookService } from '.'

/**
 * Mock required App Commands for tests
 */
beforeAll(async () => {
  mockRegisterTypedAppCommand(AppCommandIds.GET_AUTHETICATED_USER, async () => {
    return authenticatedUser
  })
  mockRegisterTypedAppCommand(AppCommandIds.SET_BOOK_FILE_PATH_SETTING, async () => {
    return
  })
  // Register the UserService commands to allow BookService to use them
  registerCommands([UserService])
})

/**
 * Tests
 */

describe('BookService', () => {
  test('test create-book', async () => {
    const response = await BookService.createBook({
      filePath: ':memory:',
      book: {
        name: 'Test Book',
        entity: 'HOUSEHOLD',
        country: 'US',
        default_currency: 'USD',
        logo: '',
      },
    })
    expect(response).toBeDefined()
    expect(response.created_on).toBeDefined()
    expect(response.modified_on).toBeDefined()
    expect(response.name).toEqual('Test Book')
  })

  test('test get-book', async () => {
    // Test Getting the Book in DB
    const book = await BookService.getBook()
    expect(book.name).toEqual('Test Book')
  })

  test('test Boook.save()', async () => {
    const book = await BookService.getBook()
    book.name = 'Test Book UPDATED'
    const updatedBook = await BookService.saveBook(book)
    expect(updatedBook.name).toEqual('Test Book UPDATED')
  })

  test('test Book.save() validation', async () => {
    // Test creating a new invalid Book country
    await expect(
      BookService.saveBook({
        name: 'Test Book Invalid',
        entity: 'HOUSEHOLD',
        country: 'XXX', // Invalid country code
        default_currency: 'USD',
        logo: '',
      }),
    ).rejects.toThrow('Cannot save BookEntity as it failed validation')
  })
})
