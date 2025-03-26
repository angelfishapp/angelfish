import { validate } from 'class-validator'
import fs from 'fs'

import type { AppCommandRequest, AppCommandResponse, IBookUpdate } from '@angelfish/core'
import { AppCommandIds, AppEventIds, Command, CommandsClient } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { BookEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'
import {
  FileAlreadyExistsError,
  FileExtensionError,
  FileNotFoundError,
} from './book-service-errors'

const logger = getWorkerLogger('BookService')

/**
 * Service to open/close and manage Book.
 */
class BookServiceClass {
  // Constants
  // TODO - Make it tropical-fish emoji: 🐠
  public readonly FILE_EXTENSION = 'afish'

  /**
   * Initialize the BookService. Will open current file from settings if not null
   */
  public async init(): Promise<void> {
    const filePath = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_BOOK_FILE_PATH_SETTING,
    )
    if (filePath != null) {
      logger.debug(`BookService init: filePath=${filePath}`)
      try {
        await this._openDatabase(filePath)
      } catch (_error) {
        // Ignore, should be already logged
      }
    }

    logger.info(`Successfully Initialised AppService: filePath=${filePath}`)
  }

  /**
   * Create a new Book and open it in the current App session. Will throw an error if the filePath
   * is invalid or if the file already exists.
   *
   * @param filePath    Filepath to create the new book at on local computer
   * @param book        Book properties to save in the new database file
   * @returns           The new Book
   */
  @Command(AppCommandIds.CREATE_BOOK)
  public async createBook({
    filePath,
    book,
  }: AppCommandRequest<AppCommandIds.CREATE_BOOK>): AppCommandResponse<AppCommandIds.CREATE_BOOK> {
    return await this._openDatabase(filePath, book)
  }

  /**
   * Open an existing Book database file and open it in the current App session.
   * Will throw an error if the filePath is invalid or database is corrupted.
   *
   * @param filePath    Filepath to create the new book at on local computer
   * @returns           The loaded Book
   */
  @Command(AppCommandIds.OPEN_BOOK)
  public async openBook({
    filePath,
  }: AppCommandRequest<AppCommandIds.OPEN_BOOK>): AppCommandResponse<AppCommandIds.OPEN_BOOK> {
    if (DatabaseManager.isInitialized) {
      // Close current book before opening new one if open
      await this.closeBook()
    }
    return await this._openDatabase(filePath)
  }

  /**
   * Close the currently opened Book database file and remove it from the current App session.
   * Will throw an error if no Book is currently opened.
   */
  @Command(AppCommandIds.CLOSE_BOOK)
  public async closeBook(
    _request: AppCommandRequest<AppCommandIds.CLOSE_BOOK>,
  ): AppCommandResponse<AppCommandIds.CLOSE_BOOK> {
    if (!DatabaseManager.isInitialized) {
      throw new Error('No Book is currently opened')
    }

    // Close the database connection
    await DatabaseManager.close()

    // Reset filePath setting
    await CommandsClient.executeAppCommand(AppCommandIds.SET_BOOK_FILE_PATH_SETTING, {
      filePath: null,
    })

    // Emit BOOK_CLOSED event to notify other services
    CommandsClient.emitAppEvent(AppEventIds.ON_BOOK_CLOSE)

    logger.info('Closed Book and removed it from current App session')
  }

  /**
   * Get the currently opened Book details from the database
   */
  @Command(AppCommandIds.GET_BOOK)
  public async getBook(
    _request: AppCommandRequest<AppCommandIds.GET_BOOK>,
  ): AppCommandResponse<AppCommandIds.GET_BOOK> {
    const bookRepo = DatabaseManager.getConnection().getRepository(BookEntity)
    const book = await bookRepo.findOne({
      where: { id: 1 },
    })
    if (book) {
      return book
    }
    throw Error('Database Corrupted: No Book found for household.')
  }

  /**
   * Update the currently opened Book details from the database
   *
   * @param request    Book properties to update in the currently opened database file
   */
  @Command(AppCommandIds.SAVE_BOOK)
  public async saveBook(
    request: AppCommandRequest<AppCommandIds.SAVE_BOOK>,
  ): AppCommandResponse<AppCommandIds.SAVE_BOOK> {
    // Validate BookEntity before making API updates
    const errors = await validate(BookEntity.getClassInstance(request), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save BookEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    // Finally save to Database & and notify service listners to update
    const bookRepo = DatabaseManager.getConnection().getRepository(BookEntity)
    const updatedBook = await bookRepo.save(request)
    return updatedBook
  }

  /**
   * Open and initialise the Database from the current filePath. Optionally pass in a new
   * book if creating the database file to ensure book table is loaded and new Cloud account
   * exists for book to sync with
   *
   * @param filePath The file path of the file to load
   * @param book     The initial household/business book to create in the new database file.
   *                 If not provided, will load the existing book from the database file.
   * @returns        The loaded Book from the database
   */
  private async _openDatabase(filePath: string, book?: IBookUpdate) {
    logger.debug('Loading Database: filePath=' + filePath + ', book=', book)

    // Support memory SQLite database for unit tests
    if (filePath !== ':memory:') {
      // Check File Extension
      const ext = filePath.substring(filePath.lastIndexOf('.') + 1)
      if (ext != this.FILE_EXTENSION) {
        throw new FileExtensionError(ext)
      }
    }

    // Close existing database if already open before loading new one
    if (DatabaseManager.isInitialized) {
      await this.closeBook()
    }

    try {
      if (book) {
        // Create a new database if book is passed in
        // Make sure we're not writing to file that already exists
        if (fs.existsSync(filePath)) {
          throw new FileAlreadyExistsError(filePath)
        }

        // Trying to create a new database
        await DatabaseManager.initConnection(filePath)
        if (filePath != ':memory:') {
          await CommandsClient.executeAppCommand(AppCommandIds.SET_BOOK_FILE_PATH_SETTING, {
            filePath,
          })
        }

        // Save the current authenticated user to the database
        const authenticatedUser = await CommandsClient.executeAppCommand(
          AppCommandIds.GET_AUTHETICATED_USER,
        )
        logger.debug('Saving authenticated user to database', authenticatedUser)
        if (!authenticatedUser) {
          throw new Error('No authenticated user found')
        }
        await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, {
          cloud_id: authenticatedUser.id,
          created_on: authenticatedUser.created_on,
          email: authenticatedUser.email,
          first_name: authenticatedUser.first_name,
          last_name: authenticatedUser.last_name,
          avatar: authenticatedUser.avatar,
          phone: authenticatedUser.phone,
        })

        // Create the database book
        const savedBook = await this.saveBook(book)
        // Emit BOOK_OPEN event to notify other services
        CommandsClient.emitAppEvent(AppEventIds.ON_BOOK_OPEN, { book: savedBook })
        return savedBook
      }
      // Opening exising database, check it exists
      if (fs.existsSync(filePath)) {
        await DatabaseManager.initConnection(filePath)
        if (filePath != ':memory:') {
          await CommandsClient.executeAppCommand(AppCommandIds.SET_BOOK_FILE_PATH_SETTING, {
            filePath,
          })
        }

        const dbBook = await this.getBook()
        // Emit BOOK_OPEN event to notify other services
        CommandsClient.emitAppEvent(AppEventIds.ON_BOOK_OPEN, { book: dbBook })
        return dbBook
      }
      throw new FileNotFoundError(filePath)
    } catch (error) {
      if (
        error instanceof FileNotFoundError ||
        error instanceof FileAlreadyExistsError ||
        error instanceof FileExtensionError
      ) {
        logger.error(`Error trying to load Database ${filePath}: ${error.message}`)
      } else {
        logger.error(`Error trying to load Database ${filePath}: ${error}`, error)
      }

      // Reset FileService
      await this.closeBook()
      throw error
    }
  }
}

// Export instance of Class
export const BookService = new BookServiceClass()
