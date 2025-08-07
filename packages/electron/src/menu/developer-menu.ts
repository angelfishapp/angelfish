import type { MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'
import type { LogLevel } from 'electron-log'
import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { initI18n } from '../i18n/main.i18n'
import { LogManager } from '../logging/log-manager'
import { settings } from '../settings'

const logger = LogManager.getMainLogger('DeveloperMenu')
const i18n = initI18n()

export const DeveloperMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.developer.label'),
  submenu: [
    { role: 'reload', label: i18n.t('menu.developer.reload') },
    { role: 'forceReload', label: i18n.t('menu.developer.forceReload') },
    { role: 'toggleDevTools', label: i18n.t('menu.developer.toggleDevTools') },
    {
      label: i18n.t('menu.developer.logLevel.label'),
      submenu: generateLogLevelMenu(),
    },
    { type: 'separator' },
    {
      label: i18n.t('menu.developer.listChannels'),
      click: () => {
        logger.info('Listing Main Connected Channels', CommandsRegistryMain.listChannels())
      },
    },
    {
      label: i18n.t('menu.developer.listCommands'),
      click: () => {
        logger.info('Listing Main Registered Commands', CommandsRegistryMain.listCommands())
      },
    },
  ],
})

/**
 * Generate a submenu to change log level of the app and any workers
 *
 * @returns MenuItemConstructorOptions[]
 */
function generateLogLevelMenu(): MenuItemConstructorOptions[] {
  const levels: LogLevel[] = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
  return levels.map((level) => ({
    label: i18n.t(`menu.developer.logLevel.${level}`),
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
