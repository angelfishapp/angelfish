import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { dialog } from 'electron'

import { CommandsRegistryMain } from '../commands/commands-registry-main'

export const FileMenu: MenuItemConstructorOptions = {
  label: 'File',
  role: 'fileMenu',
  submenu: [
    {
      label: 'Create new Household',
    },
    { type: 'separator' },
    {
      label: 'Open Household...',
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
          // TODO
        }
      },
    },
    {
      label: 'Recent Households',
    },
    { type: 'separator' },
    {
      label: 'Household Settings',
      id: 'file-settings',
      enabled: false,
    },
    {
      label: 'Syncronize Household',
      id: 'file-syncronize',
      enabled: false,
      click: async (menuItem: MenuItem) => {
        menuItem.enabled = false
        await CommandsRegistryMain.executeCommand('sync.book')
        menuItem.enabled = true
      },
    },
    { type: 'separator' },
    {
      label: 'Logout',
      id: 'file-logout',
      enabled: false,
      click: async () => {
        await CommandsRegistryMain.executeCommand('logout')
      },
    },
    { type: 'separator' },
    { role: 'quit' },
  ],
}
