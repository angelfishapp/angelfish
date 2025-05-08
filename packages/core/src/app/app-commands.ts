/**
 * Define all App wide commands here to ensure type safety and consistency across the app when calling App commands.
 *
 * To add a new command:
 *
 * 1. Add a new unique command ID to the `AppCommandIds` enum.
 * 2. Define the request and response types for the command in the `AppCommandDefinitions` interface.
 *
 * You can then use the CommandClient.executeAppCommand() method anywhere in your app to ensure type safety
 * when calling these commands and also type your Command handlers to ensure they match the request/response types defined here:
 *
 * ```typescript
 * import { AppCommandIds, Command } from '@angelfish/core'
 * import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
 *
 * // Example command handler
 * class MyCommandService {
 *  @Command(AppCommandIds.MY_COMMAND)
 *  public async handleCommand(request: AppCommandRequest<AppCommandIds.MY_COMMAND>): Promise<AppCommandResponse<AppCommandIds.MY_COMMAND>> {
 *   // Your command logic here
 *  }
 * }
 * ```
 *
 */

import type {
  IAccount,
  IAuthenticatedUser,
  IAuthenticatedUserUpdate,
  IBook,
  IBookUpdate,
  ICategoryGroup,
  IInstitution,
  IInstitutionUpdate,
  ImportTransactionsMapper,
  ITag,
  ITagUpdate,
  ITransaction,
  ITransactionUpdate,
  IUser,
  IUserUpdate,
  ParsedFileMappings,
  ReconciledTransaction,
  ReportsData,
  ReportsQuery,
} from '../types'
import type {
  IAppState,
  IAuthenticationState,
  INotificationOptions,
  IOpenFileDialogOptions,
  ISaveFileDialogOptions,
  ISyncSummary,
} from './app-command-types'

/**
 * Default Commands for App
 */
export enum AppCommandIds {
  /**
   * Get system information for current device
   */
  GET_SYSTEM_INFO = 'get.system.info',
  /**
   * Open an Electron file open dialog
   */
  SHOW_OPEN_FILE_DIALOG = 'show.open.dialog',
  /**
   * Open an Electron file save dialog
   */
  SHOW_SAVE_FILE_DIALOG = 'show.save.dialog',
  /**
   * Show a desktop notification
   */
  SHOW_NOTIFICATION = 'show.notification',
  /**
   * Open the Angelfish website in the user's default browser
   */
  OPEN_ANGELFISH_WEBSITE = 'open.angelfish.website',
  /**
   * Get the authentication state of the app persisted on disk
   */
  GET_AUTHENTICATION_SETTINGS = 'get.authentication.settings',
  /**
   * Set the authentication state of the app persisting to disk
   */
  SET_AUTHENTICATION_SETTINGS = 'set.authentication.settings',
  /**
   * Get the last opened book file path
   */
  GET_BOOK_FILE_PATH_SETTING = 'get.book.file.path.setting',
  /**
   * Set the last opened book file path
   */
  SET_BOOK_FILE_PATH_SETTING = 'set.book.file.path.setting',
  /**
   * Get the current app state (i.e. book loaded, user authenticated, etc.)
   * Used to initilise frontend on load
   */
  GET_APP_STATE = 'get.app.state',
  /**
   * Send an Out-Of-Band (OOB) code to the user's email for authentication
   */
  AUTH_SEND_OOB_CODE = 'auth.get.oob.code',
  /**
   * Authenticate a user with an OOB code sent to their email
   */
  AUTH_AUTHENTICATE = 'auth.authenticate',
  /**
   * Logout the currently authenticated user and delete any
   * active refresh tokens the Cloud API has for them
   */
  AUTH_LOGOUT = 'auth.logout',
  /**
   * Get the authenticated user's profile from Cloud API
   */
  GET_AUTHETICATED_USER = 'get.authenticated.user',
  /**
   * Update the authenticated user's profile on Cloud API
   */
  UPDATE_AUTHENTICATED_USER = 'update.authenticated.user',
  /**
   * Search Cloud API for Financial Institutions by name
   * and return a list of matching institutions
   */
  SEARCH_INSTITUTIONS = 'search.institutions',
  /**
   * Start a sync of the currently opened book file with the Cloud API
   * and return the sync status
   */
  START_SYNC = 'start.sync',
  /**
   * Create a new Book file and open it in the current App session
   */
  CREATE_BOOK = 'create.book',
  /**
   * Open an existing Book file and open it in the current App session
   */
  OPEN_BOOK = 'open.book',
  /**
   * Close the currently opened Book file and remove it from the current App session
   */
  CLOSE_BOOK = 'close.book',
  /**
   * Get the currently opened Book details from the database
   */
  GET_BOOK = 'get.book',
  /**
   * Create a new Book or Update the currently opened Book details
   */
  SAVE_BOOK = 'save.book',
  /**
   * List all Users in the database
   */
  LIST_USERS = 'list.users',
  /**
   * Get a User from the database by Id or cloud_id
   */
  GET_USER = 'get.user',
  /**
   * Save a new User or update an existing User in the database
   */
  SAVE_USER = 'save.user',
  /**
   * Delete a User from the database by Id
   */
  DELETE_USER = 'delete.user',
  /**
   * List all Accounts in the database
   */
  LIST_ACCOUNTS = 'list.accounts',
  /**
   * List all Account currencies in the database
   */
  LIST_ACCOUNT_CURRENCIES = 'list.account.currencies',
  /**
   * Get an Account from the database by Id
   */
  GET_ACCOUNT = 'get.account',
  /**
   * Save a new Account or update an existing Account in the database
   */
  SAVE_ACCOUNT = 'save.account',
  /**
   * Delete an Account from the database by Id
   */
  DELETE_ACCOUNT = 'delete.account',
  /**
   * List all Category Groups in the database
   */
  LIST_CATEGORY_GROUPS = 'list.category.groups',
  /**
   * Get a Category Group from the database by Id
   */
  GET_CATEGORY_GROUP = 'get.category.group',
  /**
   * Save a new Category Group or update an existing Category Group in the database
   */
  SAVE_CATEGORY_GROUP = 'save.category.group',
  /**
   * Delete a Category Group from the database by Id
   */
  DELETE_CATEGORY_GROUP = 'delete.category.group',
  /**
   * List all Institutions in the database
   */
  LIST_INSTITUTIONS = 'list.institutions',
  /**
   * Get an Institution from the database by Id
   */
  GET_INSTITUTION = 'get.institution',
  /**
   * Save a new Institution or update an existing Institution in the database
   */
  SAVE_INSTITUTION = 'save.institution',
  /**
   * Delete an Institution from the database by Id
   * and remove all accounts & transactions associated with it
   */
  DELETE_INSTITUTION = 'delete.institution',
  /**
   * List all Tags in the database
   */
  LIST_TAGS = 'list.tags',
  /**
   * Get a Tag from the database by Id
   */
  GET_TAG = 'get.tag',
  /**
   * Save a new Tag or update an existing Tag in the database
   */
  SAVE_TAG = 'save.tag',
  /**
   * Delete a Tag from the database by Id
   * and remove it from all line items associated with it
   */
  DELETE_TAG = 'delete.tag',
  /**
   * List all Transactions for given query
   */
  LIST_TRANSACTIONS = 'list.transactions',
  /**
   * Get the date range across all transactions in the database
   */
  GET_TRANSACTIONS_DATE_RANGE = 'get.transactions.date.range',
  /**
   * Get a Transaction from the database by Id
   */
  GET_TRANSACTION = 'get.transaction',
  /**
   * Save a new Transaction or update an existing Transaction in the database
   */
  SAVE_TRANSACTIONS = 'save.transactions',
  /**
   * Delete a Transaction from the database by Id
   * and remove all line items associated with it
   */
  DELETE_TRANSACTION = 'delete.transaction',
  /**
   * Run a Report query on the currently opened Book file
   */
  RUN_REPORT = 'run.report',
  /**
   * Export a Report query to a file (CSV, PDF, etc.)
   */
  EXPORT_REPORT = 'export.report',
  /**
   * Read an OFX, QFX, QIF or CSV File. Will get transactions from the file and then reconcile them with
   * existing transactions in the database.
   */
  IMPORT_FILE = 'import.file',
  /**
   * Parse the file to get any mappings that are required to map the file data correctly
   * to the ITransaction interface. (i,e, for CSV files)
   */
  IMPORT_MAPPINGS = 'import.mappings',
  /**
   * Once the transactions have been reconciled and reviewed by the user, complete the import
   * by committing the transactions to the database.
   */
  IMPORT_TRANSACTIONS = 'import.transactions',
  /**
   * List all Datasets in the database
   */
  LIST_DATASETS = 'list.datasets',
  /**
   * Run a saved query on a Dataset to get the data for the dataset
   */
  RUN_DATASET_QUERY = 'run.dataset.query',
  /**
   * Insert rows into a Dataset from an array of objects
   */
  INSERT_DATASET_ROWS = 'insert.dataset.rows',
}

// Define request/response types for each command
export interface AppCommandDefinitions {
  [AppCommandIds.GET_SYSTEM_INFO]: {
    request: void
    response: {
      deviceId: string
      os_platform: string
      os_release: string
      arch: string
      locale: string
      app_version: string
    }
  }
  [AppCommandIds.SHOW_OPEN_FILE_DIALOG]: {
    request: IOpenFileDialogOptions
    response: string[]
  }
  [AppCommandIds.SHOW_SAVE_FILE_DIALOG]: {
    request: ISaveFileDialogOptions
    response: string | null
  }
  [AppCommandIds.SHOW_NOTIFICATION]: {
    request: INotificationOptions
    response: void
  }
  [AppCommandIds.OPEN_ANGELFISH_WEBSITE]: {
    request: void
    response: void
  }
  [AppCommandIds.GET_AUTHENTICATION_SETTINGS]: {
    request: void
    response: IAuthenticationState
  }
  [AppCommandIds.SET_AUTHENTICATION_SETTINGS]: {
    request: IAuthenticationState
    response: void
  }
  [AppCommandIds.GET_BOOK_FILE_PATH_SETTING]: {
    request: void
    response: string | null
  }
  [AppCommandIds.SET_BOOK_FILE_PATH_SETTING]: {
    request: { filePath: string | null }
    response: void
  }
  [AppCommandIds.GET_APP_STATE]: {
    request: void
    response: IAppState
  }
  [AppCommandIds.AUTH_SEND_OOB_CODE]: {
    request: { email: string }
    response: void
  }
  [AppCommandIds.AUTH_AUTHENTICATE]: {
    request: { oob_code: string }
    response: IAuthenticatedUser
  }
  [AppCommandIds.AUTH_LOGOUT]: {
    request: void
    response: void
  }
  [AppCommandIds.GET_AUTHETICATED_USER]: {
    request: void
    response: IAuthenticatedUser | null
  }
  [AppCommandIds.UPDATE_AUTHENTICATED_USER]: {
    request: IAuthenticatedUserUpdate
    response: IAuthenticatedUser
  }
  [AppCommandIds.SEARCH_INSTITUTIONS]: {
    request: { query: string }
    response: IInstitutionUpdate[]
  }
  [AppCommandIds.START_SYNC]: {
    request: { user?: boolean; currencies?: boolean } | void
    response: ISyncSummary
  }
  [AppCommandIds.CREATE_BOOK]: {
    request: { filePath: string; book: IBookUpdate }
    response: IBook
  }
  [AppCommandIds.OPEN_BOOK]: {
    request: { filePath: string }
    response: IBook
  }
  [AppCommandIds.CLOSE_BOOK]: {
    request: void
    response: void
  }
  [AppCommandIds.GET_BOOK]: {
    request: void
    response: IBook
  }
  [AppCommandIds.SAVE_BOOK]: {
    request: IBookUpdate
    response: IBook
  }
  [AppCommandIds.LIST_USERS]: {
    request: void
    response: IUser[]
  }
  [AppCommandIds.GET_USER]: {
    request: { id?: number; cloud_id?: string }
    response: IUser | null
  }
  [AppCommandIds.SAVE_USER]: {
    request: IUserUpdate
    response: IUser
  }
  [AppCommandIds.DELETE_USER]: {
    request: { id: number }
    response: void
  }
  [AppCommandIds.LIST_ACCOUNTS]: {
    request: {
      account_class?: 'CATEGORY' | 'ACCOUNT'
      category_group_id?: number
      institution_id?: number
    }
    response: IAccount[]
  }
  [AppCommandIds.LIST_ACCOUNT_CURRENCIES]: {
    request: void
    response: { default_currency: string; foreign_currencies: string[] }
  }
  [AppCommandIds.GET_ACCOUNT]: {
    request: { id: number }
    response: IAccount | null
  }
  [AppCommandIds.SAVE_ACCOUNT]: {
    request: Partial<IAccount>
    response: IAccount
  }
  [AppCommandIds.DELETE_ACCOUNT]: {
    request: { id: number; reassignId: number | null }
    response: void
  }
  [AppCommandIds.LIST_CATEGORY_GROUPS]: {
    request: void
    response: ICategoryGroup[]
  }
  [AppCommandIds.GET_CATEGORY_GROUP]: {
    request: { id: number }
    response: ICategoryGroup | null
  }
  [AppCommandIds.SAVE_CATEGORY_GROUP]: {
    request: Partial<ICategoryGroup>
    response: ICategoryGroup
  }
  [AppCommandIds.DELETE_CATEGORY_GROUP]: {
    request: { id: number }
    response: void
  }
  [AppCommandIds.LIST_INSTITUTIONS]: {
    request: void
    response: IInstitution[]
  }
  [AppCommandIds.GET_INSTITUTION]: {
    request: { id: number }
    response: IInstitution | null
  }
  [AppCommandIds.SAVE_INSTITUTION]: {
    request: IInstitutionUpdate
    response: IInstitution
  }
  [AppCommandIds.DELETE_INSTITUTION]: {
    request: { id: number }
    response: void
  }
  [AppCommandIds.LIST_TAGS]: {
    request: void
    response: ITag[]
  }
  [AppCommandIds.GET_TAG]: {
    request: { id: number }
    response: ITag | null
  }
  [AppCommandIds.SAVE_TAG]: {
    request: ITagUpdate
    response: ITag
  }
  [AppCommandIds.DELETE_TAG]: {
    request: { id: number }
    response: void
  }
  [AppCommandIds.LIST_TRANSACTIONS]: {
    request: {
      account_id?: number
      cat_id?: number
      cat_group_id?: number
      start_date?: string
      end_date?: string
      requires_sync?: boolean
      currency_code?: string
    }
    response: ITransaction[]
  }
  [AppCommandIds.GET_TRANSACTIONS_DATE_RANGE]: {
    request: void
    response: { start_date: string | null; end_date: string | null }
  }
  [AppCommandIds.GET_TRANSACTION]: {
    request: { id: number }
    response: ITransaction | null
  }
  [AppCommandIds.SAVE_TRANSACTIONS]: {
    request: ITransactionUpdate[]
    response: ITransaction[]
  }
  [AppCommandIds.DELETE_TRANSACTION]: {
    request: { id: number }
    response: void
  }
  [AppCommandIds.RUN_REPORT]: {
    request: ReportsQuery
    response: ReportsData
  }
  [AppCommandIds.EXPORT_REPORT]: {
    request: {
      filePath: string
      fileType: 'XLSX'
      query: ReportsQuery
    }
    response: void
  }
  [AppCommandIds.IMPORT_FILE]: {
    request: { filePath: string; mapper: ImportTransactionsMapper }
    response: ReconciledTransaction[]
  }
  [AppCommandIds.IMPORT_MAPPINGS]: {
    request: { filePath: string; delimiter?: string }
    response: ParsedFileMappings
  }
  [AppCommandIds.IMPORT_TRANSACTIONS]: {
    request: { reconciledTransactions: ReconciledTransaction[] }
    response: ITransaction[]
  }
  [AppCommandIds.LIST_DATASETS]: {
    request: void
    response: string[]
  }
  [AppCommandIds.RUN_DATASET_QUERY]: {
    request: { datasetName: string; queryName: string; params?: any[] }
    response: any[]
  }
  [AppCommandIds.INSERT_DATASET_ROWS]: {
    request: { datasetName: string; rows: any[] }
    response: void
  }
}

// Type-safe utility to get request/response types dynamically
export type AppCommandRequest<T extends AppCommandIds> = AppCommandDefinitions[T]['request']
export type AppCommandResponse<T extends AppCommandIds> = Promise<
  AppCommandDefinitions[T]['response']
>
