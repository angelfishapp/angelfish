import { useGetLocalization } from '@/hooks/app/useGetLocalization'
import { AppEventIds, CommandsClient } from '@angelfish/core'
import type React from 'react'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { ILocaleData } from './types'


interface I18nContextValue {
  localeData: ILocaleData
  locale: string
  setLocale: (locale: string) => void
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

export const I18nProvider: React.FC<{
  defaultLocale?: string
  children?: ReactNode
}> = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocaleState] = useState(defaultLocale)
  // to-do define the type
  const [localeData, setLocaleData] = useState<any>()
  const { data, refetch } = useGetLocalization()

  useEffect(() => {
    setLocaleData(data)
    const onUpdate = () => {
      refetch()
    }
    CommandsClient.addEventListener(AppEventIds.ON_LOCALIZATION_UPDATED, onUpdate)

    return () => {
      CommandsClient.removeEventListener(AppEventIds.ON_LOCALIZATION_UPDATED, onUpdate)
    }
  }, [locale, data, refetch])

  // Update document direction whenever translations change
  useEffect(() => {
    if (localeData?.direction) {
      document.documentElement.setAttribute('dir', localeData.direction)
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }, [localeData])
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    // window.localization.setLocalization(newLocale)
  }

  if (!localeData) {
    // Optionally render a loading indicator or null until localeData is loaded
    return null
  }
  return (
    <I18nContext.Provider value={{ localeData, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

// useTranslate.ts
export const useTranslate = (basePath?: string) => {
  const { localeData } = useI18n()

  const getValue = (path: string): string => {
    return path
      .split('.')
      .reduce((acc: any, key) => acc?.[key], localeData) ?? path
  }

  if (basePath) {
    return basePath
      .split('.')
      .reduce((acc: any, key) => acc?.[key], localeData) ?? {}
  }

  return getValue
}

