import { AppEventIds } from '@angelfish/core/dist'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { CommandsRegistryMain } from '../commands/commands-registry-main'
import { initI18n } from '../i18n/main.i18n'
import { getLocale } from '../i18n/store'

const i18n = initI18n()

export function loadTranslationData(locale: string) {
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

export async function handleGetLocalization() {
  {
    const locale = getLocale()
    const translations = loadTranslationData(locale)
    return { locale, translations }
  }
}
export async function handleSetLocalization(_newLocale: string) {
  const translations = loadTranslationData(_newLocale)
  i18n.changeLanguage(_newLocale)
  CommandsRegistryMain.emitEvent(AppEventIds.ON_LOCALIZATION_UPDATED)
  return { locale: _newLocale, translations }
}
