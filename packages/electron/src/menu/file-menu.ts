import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { dialog } from 'electron'

import { AppCommandIds } from '@angelfish/core'
import { AppCommandsRegistryMain } from '../commands/commands-registry-main'
import { settings } from '../settings'

export const FileMenu: MenuItemConstructorOptions = {
  label: 'File',
  role: 'fileMenu',
  submenu: [
    {
      label: 'Create new Book',
    },
    { type: 'separator' },
    {
      label: 'Open Book...',
      click: async () => {
        const filePaths = await dialog.showOpenDialog({
          title: 'Select Angelfish File',
          properties: ['openFile'],
          filters: [
            {
              name: 'Angelfish File',
              extensions: ['afish'],
            },
          ],
        })

        if (!filePaths.canceled) {
          await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.OPEN_BOOK, {
            filePath: filePaths.filePaths[0],
          })
        }
      },
    },
    {
      label: 'Open Recent Book',
      role: 'recentDocuments',
      submenu: [
        {
          label: 'Clear Recent Books',
          role: 'clearRecentDocuments',
        },
      ],
    },
    { type: 'separator' },
    {
      label: 'Book Settings',
      id: 'file-settings',
      enabled: false,
    },
    {
      label: 'Syncronize Book',
      id: 'file-syncronize',
      enabled: false,
      click: async (menuItem: MenuItem) => {
        menuItem.enabled = false
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.START_SYNC)
        menuItem.enabled = true
      },
    },
    { type: 'separator' },
    {
      label: 'Logout',
      id: 'file-logout',
      enabled: settings.get('refreshToken') != null,
      click: async () => {
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
      },
    },
    { type: 'separator' },
    { role: 'quit' },
  ],
}
