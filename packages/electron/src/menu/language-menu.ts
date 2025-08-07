import { app, type MenuItemConstructorOptions } from 'electron'
import { buildMenu } from '.'
import { initI18n } from '../i18n/main.i18n'
import { getLocale, setLocale } from '../i18n/store'

const i18n = initI18n()

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
      },
    },
  ],
})
