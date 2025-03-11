import type { NotificationConstructorOptions, OpenDialogOptions, SaveDialogOptions } from 'electron'
import { dialog, Menu, Notification, shell } from 'electron'

import { MAINCommands } from '@angelfish/core'
import { CommandsRegistryMain } from './commands/commands-registry-main'
import { Environment } from './utils/environment'

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
    async (payload: OpenDialogOptions) => {
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
    async (payload: SaveDialogOptions) => {
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
    async (payload: NotificationConstructorOptions) => {
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
}
