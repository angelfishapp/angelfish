import type { JSXElementConstructor, ReactNode } from 'react'

export interface RollingContainerProps {
  className?: string
  children:
    | ReactNode
    | ((RollingContainerScrollBar: JSXElementConstructor<{ children: ReactNode }>) => ReactNode)
  showSyncScrollbar?: boolean
  syncScrollbarPosition?: 'bottom' | 'under-chart'
}
