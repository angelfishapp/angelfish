'use client'

import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'
import type { RollingContainerProps, ScrollBarInfo } from './RollingContainer.interface'
import { Root } from './RollingContainer.styles'
import { isScrolledToEnd, isScrolledToStart } from './RollingContainer.utils'

/**
 * `RollingContainer` component
 *
 * A scrollable layout container that supports multiple synchronized scrollbars,
 * useful in visual applications like charting interfaces or financial tables.
 */
export const RollingContainer: FC<RollingContainerProps> = ({
  className,
  children,
  showSyncScrollbar = true,
  syncScrollbarPosition = 'original',
}) => {
  /** Ref to the main scrollable container */
  const scrollArea = React.useRef<HTMLDivElement | null>(null)

  /** Registry of sync scrollbar metadata */
  const syncScrollbarsRef = React.useRef<Map<string, ScrollBarInfo>>(new Map())

  /** Force re-render for layout adjustments */
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  /** DOM refs for each visible sync scrollbar */
  const syncScrollbarRefs = React.useRef<Map<string, HTMLDivElement | null>>(new Map())

  /** DOM refs for scrollable content blocks tied to sync scrollbars */
  const scrollBarContainerRefs = React.useRef<Map<string, HTMLDivElement | null>>(new Map())

  /** Tracks scroll position state */
  const [scrolling, setScrolling] = React.useState<{ atStart?: boolean; atEnd?: boolean }>({
    atStart: true,
    atEnd: true,
  })

  /**
   * Recalculates whether the scroll is at the start or end
   */
  const updateScrolling = React.useCallback(() => {
    if (!scrollArea.current) return

    const start = isScrolledToStart(scrollArea.current, 10)
    const end = isScrolledToEnd(scrollArea.current, 10)

    if (start !== scrolling.atStart || end !== scrolling.atEnd) {
      setScrolling(() => ({ atStart: start, atEnd: end }))
    }
  }, [scrolling.atEnd, scrolling.atStart])

  /**
   * Synchronizes all scrollbars to the main scroll area's horizontal position
   */
  const handleMainScroll = React.useCallback(() => {
    if (!scrollArea.current) return

    updateScrolling()

    const scrollLeft = scrollArea.current.scrollLeft

    syncScrollbarRefs.current.forEach((scrollbarRef) => {
      if (scrollbarRef && scrollbarRef !== scrollArea.current) {
        scrollbarRef.scrollLeft = scrollLeft
      }
    })
  }, [updateScrolling])

  /**
   * Synchronizes the main area and other scrollbars with the one being scrolled
   *
   * @param scrollbarId - ID of the sync scrollbar being interacted with
   */
  const handleSyncScroll = React.useCallback(
    (scrollbarId: string) => {
      return () => {
        const syncScrollbarRef = syncScrollbarRefs.current.get(scrollbarId)
        if (!scrollArea.current || !syncScrollbarRef) return

        const scrollLeft = syncScrollbarRef.scrollLeft

        scrollArea.current.scrollLeft = scrollLeft

        syncScrollbarRefs.current.forEach((scrollbarRef, id) => {
          if (scrollbarRef && id !== scrollbarId && scrollbarRef !== scrollArea.current) {
            scrollbarRef.scrollLeft = scrollLeft
          }
        })

        updateScrolling()
      }
    },
    [updateScrolling],
  )

  /**
   * Calculates absolute positions for each sync scrollbar to overlay accurately
   */
  const updateSyncScrollbarPositions = React.useCallback(() => {
    if (!scrollArea.current) return

    const rootRect = scrollArea.current.parentElement?.getBoundingClientRect()
    if (!rootRect) return

    let hasChanges = false

    scrollBarContainerRefs.current.forEach((containerRef, id) => {
      if (containerRef) {
        const chartRect = containerRef.getBoundingClientRect()
        const relativeTop = chartRect.bottom - rootRect.top

        const currentScrollbarInfo = syncScrollbarsRef.current.get(id)
        if (currentScrollbarInfo && currentScrollbarInfo.top !== relativeTop) {
          syncScrollbarsRef.current.set(id, { ...currentScrollbarInfo, top: relativeTop })
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      forceUpdate()
    }
  }, [])

  /**
   * ResizeObserver to monitor layout and child dimension changes
   */
  const myObserver = React.useMemo(
    () =>
      new ResizeObserver(() => {
        if (!scrollArea.current) return

        setTimeout(() => {
          updateScrolling()
          updateSyncScrollbarPositions()
        }, 250)
      }),
    [updateScrolling, updateSyncScrollbarPositions],
  )

  /**
   * Sets up scroll and resize event listeners
   */
  React.useEffect(() => {
    if (!scrollArea.current) return

    const scrollAreaNode = scrollArea.current

    setTimeout(() => {
      updateScrolling()
      updateSyncScrollbarPositions()
    }, 250)

    scrollAreaNode.addEventListener('scroll', handleMainScroll)
    window.addEventListener('resize', updateScrolling)
    window.addEventListener('resize', updateSyncScrollbarPositions)

    scrollAreaNode.childNodes.forEach((item) => {
      myObserver.observe(item as Element)
    })

    return () => {
      scrollAreaNode.removeEventListener('scroll', handleMainScroll)
      window.removeEventListener('resize', updateScrolling)
      window.removeEventListener('resize', updateSyncScrollbarPositions)
    }
  }, [handleMainScroll, updateScrolling, updateSyncScrollbarPositions, myObserver, children])

  /**
   * Attaches scroll listeners to each sync scrollbar on mount
   */
  React.useEffect(() => {
    const cleanupFunctions: (() => void)[] = []

    syncScrollbarRefs.current.forEach((scrollbarRef, id) => {
      if (scrollbarRef) {
        const handleScroll = handleSyncScroll(id)
        scrollbarRef.addEventListener('scroll', handleScroll)

        cleanupFunctions.push(() => {
          scrollbarRef.removeEventListener('scroll', handleScroll)
        })
      }
    })

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [handleSyncScroll])

  /**
   * Ensures sync scrollbar content widths match the main scroll area
   */
  React.useEffect(() => {
    if (!scrollArea.current) return

    const updateSyncScrollbarWidths = () => {
      if (!scrollArea.current) return

      const mainScrollWidth = scrollArea.current.scrollWidth

      syncScrollbarRefs.current.forEach((scrollbarRef) => {
        if (scrollbarRef) {
          const syncContent = scrollbarRef.querySelector('.sync-content') as HTMLDivElement
          if (syncContent) {
            syncContent.style.width = `${mainScrollWidth}px`
          }
        }
      })
    }

    updateSyncScrollbarWidths()

    const resizeObserver = new ResizeObserver(() => {
      updateSyncScrollbarWidths()
      updateSyncScrollbarPositions()
    })

    resizeObserver.observe(scrollArea.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [children, updateSyncScrollbarPositions])

  /**
   * Factory to create a wrapper component that tracks a scrollable content section
   *
   * @param id - Unique sync ID
   * @returns A scroll-tracked component for content registration
   */
  const createRollingContainerScrollBar = React.useCallback((id: string) => {
    if (!syncScrollbarsRef.current.has(id)) {
      syncScrollbarsRef.current.set(id, { id, ref: null, top: 0 })
    }

    const RollingContainerScrollBar = ({ children }: { children: ReactNode }) => (
      <div
        ref={(ref) => {
          scrollBarContainerRefs.current.set(id, ref)
        }}
      >
        {children}
      </div>
    )

    RollingContainerScrollBar.displayName = `RollingContainerScrollBar_${id}`

    return RollingContainerScrollBar
  }, [])

  return (
    <Root
      className={clsx(
        className,
        scrolling.atStart ? 'atStart' : undefined,
        scrolling.atEnd ? 'atEnd' : undefined,
      )}
    >
      <div ref={scrollArea} className="scrollbar">
        {children(createRollingContainerScrollBar)}
      </div>

      {showSyncScrollbar &&
        Array.from(syncScrollbarsRef.current.entries()).map(([id, scrollbarInfo]) => (
          <div
            key={id}
            ref={(ref) => {
              syncScrollbarRefs.current.set(id, ref)
            }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: syncScrollbarPosition === 'external' ? scrollbarInfo.top : 'auto',
              bottom: syncScrollbarPosition === 'original' ? 0 : 'auto',
              overflowX: 'auto',
              overflowY: 'hidden',
              zIndex: 12,
            }}
          >
            <div
              className="sync-content"
              style={{
                height: '1px',
                backgroundColor: 'transparent',
              }}
            />
          </div>
        ))}
    </Root>
  )
}
