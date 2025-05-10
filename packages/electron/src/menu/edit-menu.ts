import type { MenuItemConstructorOptions } from 'electron'

export const EditMenu: MenuItemConstructorOptions = {
  label: 'Edit',
  role: 'editMenu',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'pasteAndMatchStyle' },
    { role: 'selectAll' },
  ],
}
