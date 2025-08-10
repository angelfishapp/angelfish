import { BrowserWindow, app, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { initI18n } from '../i18n/main.i18n'
import { getLocale } from '../i18n/store'
import { eventBus } from '../menu/language-menu'
const i18n = initI18n()

function loadTranslationData(locale: string) {
  const basePath = path.join(__dirname, '../../locales')
  if (locale === 'system') {
    locale = app.getSystemLocale().split('-')[0]
  }
  const filePath = path.join(basePath, `${locale}.json`)
  if (!fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(path.join(basePath, 'en.json'), 'utf8'))
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function registerLocalizationIPC() {
  ipcMain.handle('localization:get', () => {
    const locale = getLocale()
    const translations = loadTranslationData(locale)
    return { locale, translations }
  })

  ipcMain.handle('localization:set', async (_event, newLocale: string) => {
    const translations = loadTranslationData(newLocale)
    i18n.changeLanguage(newLocale)
    return { locale: newLocale, translations }
  })

  // When language changes, broadcast to all renderer windows
  eventBus.on('locale-changed', () => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('localization:updated')
    })
  })
}
