import type { MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'

import { settings } from '../settings'
import { ProcessIDs } from '../windows/process-ids'
import { WindowManager } from '../windows/windows-manager'

export const DeveloperMenu: MenuItemConstructorOptions = {
  label: 'Development',
  submenu: [
    { role: 'reload' },
    { role: 'forceReload' },
    {
      label: 'Toggle Developer Tools',
      accelerator: 'CmdOrCtrl+Shift+I',
      click: () => {
        const appWindow = WindowManager.getWindow(ProcessIDs.APP)
        if (appWindow) {
          appWindow.webContents.toggleDevTools()
        }
      },
    },
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
    checked: settings.get('userSettings.logLevel') === level,
    click: () => {
      settings.set('userSettings.logLevel', level)
      const menu = Menu.getApplicationMenu()
      if (menu) {
        menu.getMenuItemById(`help-enable-debug`)!.checked = level === 'debug'
      }
    },
  }))
}
