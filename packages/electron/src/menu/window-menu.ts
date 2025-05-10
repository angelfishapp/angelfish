import type { MenuItemConstructorOptions } from 'electron'

export const WindowMenu: MenuItemConstructorOptions = {
  role: 'window',
  submenu: [{ role: 'minimize' }, { role: 'close' }],
}
