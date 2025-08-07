import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { dialog } from 'electron'

import { AppCommandIds } from '@angelfish/core'
import { AppCommandsRegistryMain } from '../commands/commands-registry-main'
import { initI18n } from '../i18n/main.i18n'
import { settings } from '../settings'

const i18n = initI18n()
export const FileMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.file.label'),
  role: 'fileMenu',
  submenu: [
    {
      label: i18n.t('menu.file.createBook'),
      id: 'file-create',
      click: async () => {
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.CLOSE_BOOK)
      },
    },
    { type: 'separator' },
    {
      label: i18n.t('menu.file.openBook'),
      id: 'file-open',
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
      label: i18n.t('menu.file.openRecent'),
      id: 'file-open-recent',
      role: 'recentDocuments',
      submenu: [
        {
          label: i18n.t('menu.file.clearRecent'),
          role: 'clearRecentDocuments',
        },
      ],
    },
    { type: 'separator' },
    {
      label: i18n.t('menu.file.settings'),
      id: 'file-settings',
      enabled: settings.get('currentFilePath') !== null,
    },
    {
      label: i18n.t('menu.file.synchronize'),
      id: 'file-syncronize',
      enabled: settings.get('currentFilePath') !== null,
      click: async (menuItem: MenuItem) => {
        menuItem.enabled = false
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.START_SYNC)
        menuItem.enabled = true
      },
    },
    { type: 'separator' },
    {
      label: i18n.t('menu.file.logout'),
      id: 'file-logout',
      enabled: settings.get('refreshToken') !== null,
      click: async () => {
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.AUTH_LOGOUT)
      },
    },
    { type: 'separator' },
    { role: 'quit', label: i18n.t('menu.file.quit') },
  ],
})
