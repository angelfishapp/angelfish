'use client'

import { createContext, useContext } from 'react'
import type { RollingContainerContextType } from './RollingContainer.interface'

const RollingContainerContext = createContext<RollingContainerContextType | null>(null)

export const useRollingContainer = () => {
  const context = useContext(RollingContainerContext)
  if (!context) {
    throw new Error('RollingContainerScrollBar must be used within a RollingContainer')
  }
  return context
}

export const RollingContainerProvider = RollingContainerContext.Provider
