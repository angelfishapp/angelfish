import React from 'react'

import type { RollingContainerScrollBarProps } from '../RollingContainer.interface'
import { useRollingContainer } from '../RollingContainerContext'

export const RollingContainerScrollBar: React.FC<RollingContainerScrollBarProps> = ({ id }) => {
  const { registerScrollBar, unregisterScrollBar } = useRollingContainer()

  React.useEffect(() => {
    registerScrollBar(id, null)

    return () => {
      unregisterScrollBar(id)
    }
  }, [id, registerScrollBar, unregisterScrollBar])

  return (
    <div
      ref={(ref) => {
        registerScrollBar(id, ref)
      }}
    />
  )
}

RollingContainerScrollBar.displayName = 'RollingContainerScrollBar'
