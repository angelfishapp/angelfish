import type {
  Dispatch,
  SetStateAction} from 'react';
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type AppContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  authenticatedUser: any
  setAuthenticatedUser: Dispatch<SetStateAction<any>>
  book: any
  setBook: Dispatch<SetStateAction<any>>
  userSettings: any
  setUserSettings: Dispatch<SetStateAction<any>>
  syncStatus: any
  setSyncStatus: Dispatch<SetStateAction<any>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [book, setBook] = useState(null)
  const [userSettings, setUserSettings] = useState({})
  const [syncStatus, setSyncStatus] = useState(null)
  console.log('AppContextProvider initialized')
  console.log('isAuthenticated:', isAuthenticated)
  console.log('authenticatedUser:', authenticatedUser)
  console.log('book:', book)
  console.log('userSettings:', userSettings)
  console.log('syncStatus:', syncStatus)

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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
