import type { MenuItemConstructorOptions } from 'electron'

export const DeveloperMenu: MenuItemConstructorOptions = {
  label: 'Development',
  submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }],
}
