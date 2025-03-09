import type { MenuItem, MenuItemConstructorOptions } from 'electron'

import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { settings } from '../settings'

export const HelpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click: async () => {
        await CommandsRegistryMain.executeCommand('open.website')
      },
    },
    {
      label: 'Enable Debug Logging',
      id: 'help-enable-debug',
      enabled: true,
      type: 'checkbox',
      checked: settings.get('userSettings.enableDebugLogging'),
      click: async (menuItem: MenuItem) => {
        if (menuItem.checked) {
          settings.set('userSettings.enableDebugLogging', true)
        } else {
          settings.set('userSettings.enableDebugLogging', false)
        }
      },
    },
  ],
}
