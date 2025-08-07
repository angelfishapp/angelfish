import type { MenuItemConstructorOptions } from 'electron'
import { initI18n } from '../i18n/main.i18n'

const i18n = initI18n()

export const EditMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.edit.label'),
  role: 'editMenu',
  submenu: [
    { role: 'undo', label: i18n.t('menu.edit.undo') },
    { role: 'redo', label: i18n.t('menu.edit.redo') },
    { type: 'separator' },
    { role: 'cut', label: i18n.t('menu.edit.cut') },
    { role: 'copy', label: i18n.t('menu.edit.copy') },
    { role: 'paste', label: i18n.t('menu.edit.paste') },
    { role: 'pasteAndMatchStyle', label: i18n.t('menu.edit.pasteMatchStyle') },
    { role: 'selectAll', label: i18n.t('menu.edit.selectAll') },
  ],
})
