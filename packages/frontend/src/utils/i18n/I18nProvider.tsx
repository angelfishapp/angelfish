import { useGetLocalization } from '@/hooks/app/useGetLocalization'
import { AppEventIds, CommandsClient } from '@angelfish/core'
import type React from 'react'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { storybookData } from './mockLocalize'
import type { ILocaleData } from './types'
interface I18nContextValue {
  localeData: ILocaleData
  locale: 'en' | 'ar' | 'fr'
  setLocale: (locale: 'en' | 'ar' | 'fr') => void
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

export const I18nProvider: React.FC<{
  defaultLocale: 'en' | 'ar' | 'fr'
  children?: ReactNode
}> = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocaleState] = useState(defaultLocale)
  // to-do define the type
  const [localeData, setLocaleData] = useState<any>()
  const { data, refetch } = useGetLocalization()

  useEffect(() => {
    setLocaleData(data)
    const supportedLocales = ['en', 'ar', 'fr'] as const
    const localeFromData = supportedLocales.includes(data?.locale as any)
      ? (data?.locale as 'en' | 'ar' | 'fr')
      : defaultLocale
    setLocaleState(localeFromData)
    const onUpdate = () => {
      refetch()
    }
    CommandsClient.addEventListener(AppEventIds.ON_LOCALIZATION_UPDATED, onUpdate)

    return () => {
      CommandsClient.removeEventListener(AppEventIds.ON_LOCALIZATION_UPDATED, onUpdate)
    }
  }, [locale, data, refetch, defaultLocale])

  // Update document direction whenever translations change
  useEffect(() => {
    if (localeData?.direction) {
      document.documentElement.setAttribute('dir', localeData.direction)
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }, [localeData])
  const setLocale = (newLocale: 'en' | 'ar' | 'fr') => {
    setLocaleState(newLocale)
    // window.localization.setLocalization(newLocale)
  }

  if (!localeData) {
    // Optionally render a loading indicator or null until localeData is loaded
    return null
  }
  return (
    <I18nContext.Provider value={{ localeData, locale, setLocale, dir: localeData.direction }}>
      {children}
    </I18nContext.Provider>
  )
}

// useTranslate.ts
// Extend Window interface for Storybook globals
declare global {
  interface Window {
    __STORYBOOK_CLIENT_API__?: any
    __STORYBOOK_ADDONS_CHANNEL__?: any
  }
}

export const isStorybook = () => {
  if (typeof window === 'undefined') return false

  // Check for Storybook's global client API
  if (window.__STORYBOOK_CLIENT_API__) {
    return true
  }

  // Check for other Storybook globals
  if (window.__STORYBOOK_ADDONS_CHANNEL__) {
    return true
  }

  return false
}
export const useTranslate = (basePath?: string) => {
  if (isStorybook()) {
    const localeData = storybookData

    if (basePath) {
      const segments = basePath.split('.')
      let acc: any = localeData

      for (const key of segments) {
        if (acc && key in acc) {
          acc = acc[key]
        } else {
          return {} // if basePath invalid, return empty object
        }
      }
      return acc
    }

    // Return the entire localeData object when no basePath is provided
    return localeData
  }
  // eslint-disable-next-line
  else {
    // eslint-disable-next-line
    const { localeData } = useI18n()

    if (basePath) {
      const segments = basePath.split('.')
      let acc: any = localeData

      for (const key of segments) {
        if (acc && key in acc) {
          acc = acc[key]
        } else {
          return {} // if basePath invalid, return empty object
        }
      }
      return acc
    }
    // Return the entire localeData object when no basePath is provided
    return localeData
  }
}
