import { app, dialog, Menu, Notification, safeStorage, shell } from 'electron'

import type { AppCommandRequest, AppCommandResponse, IBook } from '@angelfish/core'
import { AppCommandIds, AppEventIds } from '@angelfish/core'
import { AppCommandsRegistryMain, CommandsRegistryMain } from './commands/commands-registry-main'
import { LogManager } from './logging/log-manager'
import { settings } from './settings'
import { Environment } from './utils/environment'

const logger = LogManager.getMainLogger('MainCommands')

// Keep track of current App state
let book_isOpen: boolean = false

/**
 * Setup Main Event Listerners and Commands
 */
export function setupMainCommands() {
  // Register Event Handlers

  // Handle Login Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_LOGIN, () => {
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      const fileLogout = appMenu.getMenuItemById('file-logout')
      if (fileSync) {
        if (book_isOpen) {
          fileSync.enabled = true
        }
      }
      if (fileLogout) {
        fileLogout.enabled = true
      }
    }
  })

  // Handle Logout Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_LOGOUT, () => {
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      const fileLogout = appMenu.getMenuItemById('file-logout')
      if (fileSync) {
        fileSync.enabled = false
      }
      if (fileLogout) {
        fileLogout.enabled = false
      }
    }
  })

  // Handle Book Opened Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_BOOK_OPEN, () => {
    book_isOpen = true
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      if (fileSync) {
        fileSync.enabled = true
      }
    }
  })

  // Handle Book Closed Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_BOOK_CLOSE, () => {
    book_isOpen = false
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      if (fileSync) {
        fileSync.enabled = true
      }
    }
  })

  // Handle Sync Started Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_SYNC_STARTED, () => {
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      if (fileSync) {
        fileSync.enabled = false
      }
    }
  })

  // Handle Sync Finished Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_SYNC_FINISHED, () => {
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      if (fileSync) {
        fileSync.enabled = true
      }
    }
  })

  // Handle Online Status Changed Event
  AppCommandsRegistryMain.addAppEventListener(AppEventIds.ON_ONLINE_STATUS_CHANGED, (event) => {
    if (event) {
      const appMenu = Menu.getApplicationMenu()
      if (appMenu) {
        const fileSync = appMenu.getMenuItemById('file-syncronize')
        if (fileSync) {
          fileSync.enabled = event.isOnline
        }
      }
    }
  })

  // Setup Event Emitters

  // Add an event emitter whenever userSettings change
  settings.onDidChange('userSettings', (changes) => {
    if (changes) {
      AppCommandsRegistryMain.emitAppEvent(AppEventIds.ON_USER_SETTINGS_UPDATED, changes)
    }
  })

  // Register Main Commands

  /**
   * Show File Open Dialog. Returns array of open files, empty if user cancelled dialog without
   * selecting anything.
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.SHOW_OPEN_FILE_DIALOG,
    async (
      request: AppCommandRequest<AppCommandIds.SHOW_OPEN_FILE_DIALOG>,
    ): AppCommandResponse<AppCommandIds.SHOW_OPEN_FILE_DIALOG> => {
      const filePath = await dialog.showOpenDialog(request)
      if (!filePath.canceled) {
        return filePath.filePaths
      }
      return []
    },
  )

  /**
   * Show Save As Dialog. Returns filepath to location to save file too, or null if user
   * cancelled dialog.
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.SHOW_SAVE_FILE_DIALOG,
    async (
      request: AppCommandRequest<AppCommandIds.SHOW_SAVE_FILE_DIALOG>,
    ): AppCommandResponse<AppCommandIds.SHOW_SAVE_FILE_DIALOG> => {
      const filePath = await dialog.showSaveDialog(request)
      if (!filePath.canceled) {
        return filePath.filePath
      }
      return null
    },
  )

  /**
   * Show Desktop Notification
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.SHOW_NOTIFICATION,
    async (
      request: AppCommandRequest<AppCommandIds.SHOW_NOTIFICATION>,
    ): AppCommandResponse<AppCommandIds.SHOW_NOTIFICATION> => {
      // Show Desktop Notificiation
      if (!Environment.isTest) {
        new Notification(request).show()
      }
    },
  )

  /**
   * Open up local browser with Angelfish website
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.OPEN_ANGELFISH_WEBSITE,
    async (
      _r: AppCommandRequest<AppCommandIds.OPEN_ANGELFISH_WEBSITE>,
    ): AppCommandResponse<AppCommandIds.OPEN_ANGELFISH_WEBSITE> => {
      await shell.openExternal('https://www.angelfish.app')
    },
  )

  /**
   * Command to get the Authentication State for the App from settings persisted on disk
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.GET_AUTHENTICATION_SETTINGS,
    async (
      _r: AppCommandRequest<AppCommandIds.GET_AUTHENTICATION_SETTINGS>,
    ): AppCommandResponse<AppCommandIds.GET_AUTHENTICATION_SETTINGS> => {
      // Unencrypt the refresh token before returning it to the caller
      // If decryption fails, reset authentication state and return nulls
      try {
        const refreshToken = settings.get('refreshToken')
        if (refreshToken) {
          return {
            authenticatedUser: settings.getAuthenticatedUser(),
            refreshToken: safeStorage.decryptString(Buffer.from(refreshToken, 'base64')),
          }
        }
      } catch (error) {
        logger.error(
          'Error decrypting refresh token, resetting authentication state to null',
          error,
        )
        settings.setAuthenticatedUser(null)
        settings.set('refreshToken', null)
      }

      // Return Reset Authentication State
      return {
        authenticatedUser: null,
        refreshToken: null,
      }
    },
  )

  /**
   * Command to set the Authentication State for the App. Will persist to disk using settings
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.SET_AUTHENTICATION_SETTINGS,
    async ({
      authenticatedUser,
      refreshToken,
    }: AppCommandRequest<AppCommandIds.SET_AUTHENTICATION_SETTINGS>): AppCommandResponse<AppCommandIds.SET_AUTHENTICATION_SETTINGS> => {
      if (authenticatedUser !== undefined) {
        // Set AuthenticatedUser State
        settings.setAuthenticatedUser(authenticatedUser)
      }

      if (refreshToken !== undefined) {
        // Set RefreshToken State
        if (refreshToken === null) {
          // If refreshToken is null, remove it from settings
          settings.set('refreshToken', null)
        } else {
          // Encrypt the refresh token before saving to disk, will throw error
          // back to caller if encryption fails
          const buffer = safeStorage.encryptString(refreshToken)
          settings.set('refreshToken', buffer.toString('base64'))
        }
      }
    },
  )

  /**
   * Get the last opened book file path
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.GET_BOOK_FILE_PATH_SETTING,
    async (
      _r: AppCommandRequest<AppCommandIds.GET_BOOK_FILE_PATH_SETTING>,
    ): AppCommandResponse<AppCommandIds.GET_BOOK_FILE_PATH_SETTING> => {
      return settings.get('currentFilePath') ?? null
    },
  )

  /**
   * Set the last opened book file path
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.SET_BOOK_FILE_PATH_SETTING,
    async ({
      filePath,
    }: AppCommandRequest<AppCommandIds.SET_BOOK_FILE_PATH_SETTING>): AppCommandResponse<AppCommandIds.SET_BOOK_FILE_PATH_SETTING> => {
      settings.set('currentFilePath', filePath)
      if (filePath) {
        // Add file to recent documents
        app.addRecentDocument(filePath)
      }
    },
  )

  /**
   * Get the current App state - used to initialize the App on startup
   */
  CommandsRegistryMain.registerCommand(
    AppCommandIds.GET_APP_STATE,
    async (
      _r: AppCommandRequest<AppCommandIds.GET_APP_STATE>,
    ): AppCommandResponse<AppCommandIds.GET_APP_STATE> => {
      // Get local app settings then pull data from other processes if needed
      // to get the full current app state
      const authenticatedUser = settings.getAuthenticatedUser()
      const refreshToken = settings.get('refreshToken')
      const bookFilePath = settings.get('currentFilePath')
      const userSettings = settings.get('userSettings')

      let book: IBook | undefined = undefined
      if (bookFilePath !== null) {
        book = await CommandsRegistryMain.executeCommand<
          AppCommandResponse<AppCommandIds.GET_BOOK>,
          AppCommandRequest<AppCommandIds.GET_BOOK>
        >(AppCommandIds.GET_BOOK)
      }

      return {
        authenticated: authenticatedUser !== null && refreshToken !== null,
        authenticatedUser: authenticatedUser !== null ? authenticatedUser : undefined,
        book,
        bookFilePath: bookFilePath !== null ? bookFilePath : undefined,
        userSettings,
      }
    },
  )
}
