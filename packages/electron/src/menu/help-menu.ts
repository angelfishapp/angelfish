import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'

import { AppCommandIds } from '@angelfish/core'
import { AppCommandsRegistryMain } from '../commands/commands-registry-main'
import { settings } from '../settings'

export const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click: async () => {
        await AppCommandsRegistryMain.executeAppCommand(AppCommandIds.OPEN_ANGELFISH_WEBSITE)
      },
    },
    {
      label: 'Enable Debug Logging',
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
}
