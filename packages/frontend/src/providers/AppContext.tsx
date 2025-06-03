import type { IAuthenticatedUser, IUserSettings } from '@angelfish/core'
import type { IBook } from '@angelfish/core/src/types'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Represents the shape of the application context used for managing global state.
 */
type AppContextType = {
  /**
   * Whether the user is currently authenticated.
   */
  isAuthenticated: boolean

  /**
   * Sets the authenticated state.
   * @param value - Boolean value to set isAuthenticated.
   */
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>

  /**
   * Currently authenticated user object.
   */
  authenticatedUser: IAuthenticatedUser

  /**
   * Sets the authenticated user.
   * @param user - The authenticated user to set.
   */
  setAuthenticatedUser: Dispatch<SetStateAction<IAuthenticatedUser>>

  /**
   * Currently opened book.
   */
  book: IBook

  /**
   * Sets the current book.
   * @param book - The book object to set.
   */
  setBook: Dispatch<SetStateAction<IBook>>

  /**
   * Current user settings.
   */
  userSettings: IUserSettings

  /**
   * Sets the user settings.
   * @param settings - The settings to apply for the user.
   */
  setUserSettings: Dispatch<SetStateAction<IUserSettings>>

  /**
   * Current sync status, e.g., "started", "finished".
   */
  syncStatus: string

  /**
   * Sets the sync status.
   * @param status - New sync status string.
   */
  setSyncStatus: Dispatch<SetStateAction<string>>

  /**
   * Whether the application has completed its initialisation.
   */
  isInitialised: boolean

  /**
   * Sets the initialisation state of the app.
   * @param initialised - Boolean indicating initialisation status.
   */
  setIsInitialised: Dispatch<SetStateAction<boolean>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState({} as IAuthenticatedUser)
  const [book, setBook] = useState({} as IBook)
  const [userSettings, setUserSettings] = useState<IUserSettings>({} as IUserSettings)
  const [syncStatus, setSyncStatus] = useState('')
  const [isInitialised, setIsInitialised] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authenticatedUser,
        setAuthenticatedUser,
        book,
        setBook,
        userSettings,
        setUserSettings,
        syncStatus,
        setSyncStatus,
        isInitialised,
        setIsInitialised,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
