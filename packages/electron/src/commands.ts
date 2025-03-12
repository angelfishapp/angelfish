import { dialog, Menu, Notification, safeStorage, shell } from 'electron'

import type {
  IAuthenticationState,
  IBookFilePath,
  INotificationOptions,
  IOpenFileDialogOptions,
  ISaveFileDialogOptions,
} from '@angelfish/core'
import { MAINCommands } from '@angelfish/core'
import { CommandsRegistryMain } from './commands/commands-registry-main'
import { LogManager } from './logging/log-manager'
import { settings } from './settings'
import { Environment } from './utils/environment'

const logger = LogManager.getMainLogger('MainCommands')

/**
 * Setup Main Event Listerners and Commands
 */
export function setupMainCommands() {
  // Register Event Handlers

  // Handle Login Event
  CommandsRegistryMain.addEventListener('on-login', (payload: any) => {
    const appMenu = Menu.getApplicationMenu()
    if (appMenu) {
      const fileSync = appMenu.getMenuItemById('file-syncronize')
      const fileLogout = appMenu.getMenuItemById('file-logout')
      if (fileSync) {
        if (payload.book) {
          fileSync.enabled = true
        }
      }
      if (fileLogout) {
        fileLogout.enabled = true
      }
    }
  })

  // Handle Logout Event
  CommandsRegistryMain.addEventListener('on-logout', (_payload: any) => {
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

  // Register Main Commands

  /**
   * Show File Open Dialog. Returns array of open files, empty if user cancelled dialog without
   * selecting anything.
   */
  CommandsRegistryMain.registerCommand(
    MAINCommands.SHOW_OPEN_FILE_DIALOG,
    async (payload: IOpenFileDialogOptions) => {
      const filePath = await dialog.showOpenDialog(payload)
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
    MAINCommands.SHOW_SAVE_FILE_DIALOG,
    async (payload: ISaveFileDialogOptions) => {
      const filePath = await dialog.showSaveDialog(payload)
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
    MAINCommands.SHOW_NOTIFICATION,
    async (payload: INotificationOptions) => {
      // Show Desktop Notificiation
      if (!Environment.isTest) {
        new Notification(payload).show()
      }
    },
  )

  /**
   * Open up local browser with Angelfish website
   */
  CommandsRegistryMain.registerCommand(MAINCommands.OPEN_WEBSITE, async () => {
    await shell.openExternal('https://www.angelfish.app')
  })

  /**
   * Command to get the Authentication State for the App from settings persisted on disk
   */
  CommandsRegistryMain.registerCommand(
    MAINCommands.GET_AUTHENTICATION,
    async (): Promise<IAuthenticationState> => {
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
    MAINCommands.SET_AUTHENTICATION,
    async (payload: IAuthenticationState) => {
      // Set Authentication State
      settings.setAuthenticatedUser(payload.authenticatedUser ?? null)
      if (payload.refreshToken) {
        // Encrypt the refresh token before saving to disk, will throw error
        // back to caller if encryption fails
        const buffer = safeStorage.encryptString(payload.refreshToken)
        settings.set('refreshToken', buffer.toString('base64'))
      } else {
        settings.set('refreshToken', null)
      }
    },
  )

  /**
   * Get the last opened book file path
   */
  CommandsRegistryMain.registerCommand(
    MAINCommands.GET_BOOK_FILE_PATH,
    async (): Promise<IBookFilePath> => {
      return {
        filePath: settings.get('currentFilePath') ?? null,
      }
    },
  )

  /**
   * Set the last opened book file path
   */
  CommandsRegistryMain.registerCommand(
    MAINCommands.SET_BOOK_FILE_PATH,
    async (payload: IBookFilePath) => {
      settings.set('currentFilePath', payload.filePath ?? null)
    },
  )
}
