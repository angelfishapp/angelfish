import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'

import { AppCommandIds } from '@angelfish/core'
import { AppCommandsRegistryMain } from '../commands/commands-registry-main'
import { initI18n } from '../i18n/main.i18n'
import { settings } from '../settings'

const i18n = initI18n()

export const HelpMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.help.label'),
  role: 'help',
  submenu: [
    {
      label: i18n.t('menu.help.learnMore'),
      click: async () => {
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.OPEN_ANGELFISH_WEBSITE)
      },
    },
    {
      label: i18n.t('menu.help.enableDebug'),
      id: 'help-enable-debug',
      enabled: true,
      type: 'checkbox',
      checked: settings.get('logLevel') === 'debug',
      click: async (menuItem: MenuItem) => {
        let level: LogLevel = 'info'
        if (menuItem.checked) {
          level = 'debug'
          settings.set('logLevel', level)
        } else {
          settings.set('logLevel', level)
        }
        const menu = Menu.getApplicationMenu()
        if (menu) {
          const menuItem = menu.getMenuItemById(`developer-log-level-${level}`)
          if (menuItem) {
            menuItem.checked = true
          }
        }
      },
    },
  ],
})
