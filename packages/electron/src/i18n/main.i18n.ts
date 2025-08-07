import fs from 'fs'
import i18next from 'i18next'
import path from 'path'
import { getLocale } from './store' // Your own locale loader
const supportedLanguages = ['en', 'ar']

const loadTranslations = (lng: string) => {
  const filePath = path.join(__dirname, '../../locales', `${lng}.json`)
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
}

export const initI18n = () => {
  const lng = getLocale()

  const resources = Object.fromEntries(
    supportedLanguages.map((lang) => [lang, { translation: loadTranslations(lang) }]),
  )

  i18next.init({
    lng,
    fallbackLng: 'en',
    resources,
  })

  return i18next
}
