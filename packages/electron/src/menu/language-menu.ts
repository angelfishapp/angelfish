import { AppEventIds } from '@angelfish/core/dist'
import { app, type MenuItemConstructorOptions } from 'electron'
import { EventEmitter } from 'events'
import { buildMenu } from '.'
import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { initI18n } from '../i18n/main.i18n'
import { getLocale, setLocale } from '../i18n/store'

const i18n = initI18n()
export const eventBus = new EventEmitter()
export const LanguageMenu = (): MenuItemConstructorOptions => ({
  label: i18n.t('menu.language.label'),
  submenu: [
    {
      label: i18n.t('menu.language.systemDefault'),
      type: 'radio',
      checked: getLocale() === 'system',
      click: () => {
        const sysLocale = app.getSystemLocale()
        setLocale('system')
        i18n.changeLanguage(sysLocale)
        buildMenu()
        CommandsRegistryMain.emitEvent(AppEventIds.ON_LOCALIZATION_UPDATED)
      },
    },
    {
      label: i18n.t('menu.language.english'),
      type: 'radio',
      checked: getLocale() === 'en',
      click: async () => {
        setLocale('en')
        await i18n.changeLanguage('en')
        buildMenu()
        CommandsRegistryMain.emitEvent(AppEventIds.ON_LOCALIZATION_UPDATED)
      },
    },
    {
      label: i18n.t('menu.language.arabic'),
      type: 'radio',
      checked: getLocale() === 'ar',
      click: async () => {
        setLocale('ar')
        await i18n.changeLanguage('ar')
        buildMenu()
        CommandsRegistryMain.emitEvent(AppEventIds.ON_LOCALIZATION_UPDATED)
      },
    },
    {
      label: i18n.t('menu.language.french'),
      type: 'radio',
      checked: getLocale() === 'fr',
      click: async () => {
        setLocale('fr')
        await i18n.changeLanguage('fr')
        buildMenu()
        CommandsRegistryMain.emitEvent(AppEventIds.ON_LOCALIZATION_UPDATED)
      },
    },
  ],
})
