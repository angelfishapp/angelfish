import type React from 'react'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

// Extend the Window interface to include localization Api
declare global {
  interface Window {
    localization: {
      getLocalization: () => Promise<any>
      setLocalization: (locale: string) => Promise<any>
      onLocalizationUpdated: (callback: () => void) => void
      removeLocalizationListeners: () => void
    }
  }
}

type Translations = {
  direction: 'ltr' | 'rtl'
  menu: {
    developer: {
      label: string
      reload: string
      forceReload: string
      toggleDevTools: string
      logLevel: {
        label: string
        error: string
        warn: string
        info: string
        debug: string
        verbose: string
      }
      listChannels: string
      listCommands: string
    }
    edit: {
      label: string
      undo: string
      redo: string
      cut: string
      copy: string
      paste: string
      pasteMatchStyle: string
      selectAll: string
    }
    file: {
      label: string
      createBook: string
      openBook: string
      openRecent: string
      clearRecent: string
      bookSettings: string
      syncBook: string
      settings: string
      synchronize: string
      logout: string
      quit: string
    }
    help: {
      label: string
      learnMore: string
      enableDebug: string
    }
    view: {
      label: string
      enableAnimations: string
      resetZoom: string
      zoomIn: string
      zoomOut: string
      toggleFullscreen: string
    }
    window: {
      label: string
      minimize: string
      close: string
    }
    language: {
      label: string
      systemDefault: string
      english: string
      arabic: string
    }
  }
  frontEnd: {
    accounts: {
      title: string
      createAccount: string
      editAccount: string
      deleteAccount: string
      accountName: string
      balance: string
      viewSettings: string
      groupBy: string
      institution: string
      country: string
      currency: string
      accountOwner: string
      accountType: string
      sortBy: string
      sortAZ: string
      accountBalance: string
      showClosedAccounts: string
    }
  }
}
interface LocaleData {
  locale: string
  translations: Translations
  direction: 'ltr' | 'rtl'
}

interface I18nContextValue {
  localeData: LocaleData
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
  const [localeData, setLocaleData] = useState<LocaleData>()
  // Fetch localeData from Electron main via IPC
  const fetchTranslations = async (_loc: string) => {
    const data = await window.localization.getLocalization()
    setLocaleData(data)
  }

  useEffect(() => {
    fetchTranslations(locale)

    // Listen for updates (e.g. locale changed from main)
    const onUpdate = () => fetchTranslations(locale)
    window.localization.onLocalizationUpdated(onUpdate)
    return () => {
      window.localization.removeLocalizationListeners()
    }
  }, [locale])
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
    window.localization.setLocalization(newLocale)
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
