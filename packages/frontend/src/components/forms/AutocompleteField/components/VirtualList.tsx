import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'

/**
 * Component Styles
 */

const useStyles = makeStyles<Theme>(() => ({
  virtualList: {
    '& ul': {
      margin: 0,
    },
  },
}))

/**
 * ListboxComponent Adaptor for Virtualiszed List Component
 */
export const VirtualizedListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function VirtualizedListboxComponent({ children, ...other }, _ref) {
  const classes = useStyles()

  const itemData = React.Children.toArray(children)

  // React-Virtual State
  const listContainerRef = React.useRef<HTMLDivElement>(null)

  // React-Virtual Configuration
  const virtualizer = useVirtualizer({
    count: itemData.length,
    getScrollElement: () => listContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  return (
    <div ref={listContainerRef} className={classes.virtualList} {...other}>
      <ul style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          return React.cloneElement(itemData[virtualItem.index] as any, {
            key: virtualItem.key,
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            },
          })
        })}
      </ul>
    </div>
  )
})
