import type { MenuItemConstructorOptions } from 'electron'

export const AppMenu = (): MenuItemConstructorOptions => ({
  label: 'Angelfish',
  role: 'appMenu',
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideOthers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ],
})
