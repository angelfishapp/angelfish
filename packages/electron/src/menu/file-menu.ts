import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { dialog } from 'electron'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds } from '@angelfish/core'
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
        await CommandsRegistryMain.executeCommand<
          AppCommandResponse<AppCommandIds.START_SYNC>,
          AppCommandRequest<AppCommandIds.START_SYNC>
        >(AppCommandIds.START_SYNC)
        menuItem.enabled = true
      },
    },
    { type: 'separator' },
    {
      label: 'Logout',
      id: 'file-logout',
      enabled: false,
      click: async () => {
        await CommandsRegistryMain.executeCommand<
          AppCommandResponse<AppCommandIds.AUTH_LOGOUT>,
          AppCommandRequest<AppCommandIds.AUTH_LOGOUT>
        >(AppCommandIds.AUTH_LOGOUT)
      },
    },
    { type: 'separator' },
    { role: 'quit' },
  ],
}
