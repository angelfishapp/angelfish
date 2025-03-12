import type { MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'

import { settings } from '../settings'

export const DeveloperMenu: MenuItemConstructorOptions = {
  label: 'Development',
  submenu: [
    { role: 'reload' },
    { role: 'forceReload' },
    { role: 'toggleDevTools' },
    {
      label: 'Log Level',
      submenu: generateLogLevelMenu(),
    },
  ],
}

/**
 * Generate a submenu to change log level of the app and any workers
 *
 * @returns MenuItemConstructorOptions[]
 */
function generateLogLevelMenu(): MenuItemConstructorOptions[] {
  const levels: LogLevel[] = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
  return levels.map((level) => ({
    label: level,
    id: `developer-log-level-${level}`,
    type: 'radio',
    checked: settings.get('logLevel') === level,
    click: () => {
      settings.set('logLevel', level)
      const menu = Menu.getApplicationMenu()
      if (menu) {
        menu.getMenuItemById(`help-enable-debug`)!.checked = level === 'debug'
      }
    },
  }))
}
