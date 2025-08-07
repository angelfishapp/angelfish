import type { MenuItemConstructorOptions } from 'electron'

import { initI18n } from '../i18n/main.i18n'
import { settings } from '../settings'

const i18n = initI18n()

export const ViewMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.view.label'),
  role: 'viewMenu',
  submenu: [
    {
      label: i18n.t('menu.view.enableAnimations'),
      id: 'view-enable-animations',
      enabled: true,
      type: 'checkbox',
      checked: settings.get('userSettings.enableBackgroundAnimations'),
      click: async () => {
        // Save setting
        const currentValue = settings.get('userSettings.enableBackgroundAnimations')
        settings.set('userSettings.enableBackgroundAnimations', !currentValue)
      },
    },
    { type: 'separator' },
    { role: 'resetZoom', label: i18n.t('menu.view.resetZoom') },
    { role: 'zoomIn', label: i18n.t('menu.view.zoomIn') },
    { role: 'zoomOut', label: i18n.t('menu.view.zoomOut') },
    { type: 'separator' },
    { role: 'togglefullscreen', label: i18n.t('menu.view.toggleFullscreen') },
  ],
})
