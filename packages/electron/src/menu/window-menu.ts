import type { MenuItemConstructorOptions } from 'electron'
import { initI18n } from '../i18n/main.i18n'

const i18n = initI18n()
export const WindowMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.window.label'),
  role: 'window',
  submenu: [
    { role: 'minimize', label: i18n.t('menu.window.minimize') },
    { role: 'close', label: i18n.t('menu.window.close') },
  ],
})
