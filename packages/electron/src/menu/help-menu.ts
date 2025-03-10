import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'

import { MAINCommands } from '@angelfish/core'
import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { settings } from '../settings'

export const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click: async () => {
        await CommandsRegistryMain.executeCommand(MAINCommands.OPEN_WEBSITE)
      },
    },
    {
      label: 'Enable Debug Logging',
      id: 'help-enable-debug',
      enabled: true,
      type: 'checkbox',
      checked: settings.get('userSettings.logLevel') === 'debug',
      click: async (menuItem: MenuItem) => {
        let level: LogLevel = 'info'
        if (menuItem.checked) {
          level = 'debug'
          settings.set('userSettings.logLevel', level)
        } else {
          settings.set('userSettings.logLevel', level)
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
