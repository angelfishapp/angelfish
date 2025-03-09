import type { MenuItemConstructorOptions } from 'electron'

import { settings } from '../settings'

export const ViewMenu: MenuItemConstructorOptions = {
  label: 'View',
  role: 'viewMenu',
  submenu: [
    {
      label: 'Enable Background Animations',
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
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'togglefullscreen' },
  ],
}
