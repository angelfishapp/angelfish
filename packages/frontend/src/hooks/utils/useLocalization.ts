import { useEffect, useState } from 'react'

export function useLocalization() {
  const [locale, setLocale] = useState<string>('en')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  const fetchLocalization = async () => {
    const data = await window.localization.getLocalization()
    setLocale(data.locale)
    setTranslations(data.translations)
  }

  const changeLocale = async (newLocale: string) => {
    const data = await window.localization.setLocalization(newLocale)
    setLocale(data.locale)
    setTranslations(data.translations)
  }

  useEffect(() => {
    fetchLocalization()

    // Listen for menu-triggered updates
    window.localization.onLocalizationUpdated(fetchLocalization)

    return () => {
      window.localization.removeLocalizationListeners()
    }
  }, [])

  return { locale, translations, changeLocale }
}
