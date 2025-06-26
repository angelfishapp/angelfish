'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import type { RollingContainerProps } from './RollingContainer.interface'
import { Root } from './RollingContainer.styles'
import { isScrolledToEnd, isScrolledToStart } from './RollingContainer.utils'

/**
 * Provides RollingContainer component that displays shadow effects if the viewport shrinks below the size of the container to
 * give a scrolling effect inside the container like its rolling behind the background.
 */
export const RollingContainer: FC<RollingContainerProps> = ({
  className,
  children,
  showSyncScrollbar = true,
  syncScrollbarPosition = 'bottom',
}) => {
  // setup scrolling detection
  const scrollArea = React.useRef<HTMLDivElement | null>(null)
  const syncScrollbar = React.useRef<HTMLDivElement | null>(null)
  const RollingContainerScrollBarRef = React.useRef<HTMLDivElement | null>(null)
  const [scrolling, setScrolling] = React.useState<{ atStart?: boolean; atEnd?: boolean }>({
    atStart: true,
    atEnd: true,
  })
  const [syncScrollbarTop, setSyncScrollbarTop] = React.useState<number>(0)

  const updateScrolling = React.useCallback(() => {
    if (!scrollArea?.current) return
    const start = isScrolledToStart(scrollArea.current, 10)
    const end = isScrolledToEnd(scrollArea.current, 10)

    // if scrolled value is different
    if (start !== scrolling.atStart || end !== scrolling.atEnd) {
      setScrolling(() => ({ atStart: start, atEnd: end }))
    }
  }, [scrolling.atEnd, scrolling.atStart])

  // Sync scroll positions
  const handleMainScroll = React.useCallback(() => {
    if (!scrollArea.current || !syncScrollbar.current) return

    updateScrolling()

    // Sync the custom scrollbar with main scroll area
    const scrollLeft = scrollArea.current.scrollLeft
    syncScrollbar.current.scrollLeft = scrollLeft
  }, [updateScrolling])

  const handleSyncScroll = React.useCallback(() => {
    if (!scrollArea.current || !syncScrollbar.current) return

    // Sync the main scroll area with custom scrollbar
    const scrollLeft = syncScrollbar.current.scrollLeft
    scrollArea.current.scrollLeft = scrollLeft

    updateScrolling()
  }, [updateScrolling])

  // Calculate sync scrollbar position
  const updateSyncScrollbarPosition = React.useCallback(() => {
    if (!RollingContainerScrollBarRef.current || !scrollArea.current) return

    const chartRect = RollingContainerScrollBarRef.current.getBoundingClientRect()
    const rootRect = scrollArea.current.parentElement?.getBoundingClientRect()

    if (!rootRect) return

    // Position relative to the root container
    const relativeTop = chartRect.bottom - rootRect.top
    setSyncScrollbarTop(relativeTop) // 8px margin
  }, [])

  // this will get called whenever div dimension changes
  const myObserver = React.useMemo(
    () =>
      new ResizeObserver(() => {
        if (!scrollArea?.current) return
        // should update where the scroll is on first render
        setTimeout(() => {
          updateScrolling()
          updateSyncScrollbarPosition()
        }, 250)
      }),
    [updateScrolling, updateSyncScrollbarPosition],
  )

  // detect scrolled position
  React.useEffect(() => {
    if (!scrollArea?.current) return
    const scrollAreaNode = scrollArea.current
    // should update where the scroll is on first render
    setTimeout(() => {
      updateScrolling()
      updateSyncScrollbarPosition()
    }, 250)

    // Add scroll event listeners
    scrollAreaNode.addEventListener('scroll', handleMainScroll)
    window.addEventListener('resize', updateScrolling)
    window.addEventListener('resize', updateSyncScrollbarPosition)

    scrollAreaNode.childNodes.forEach((item) => {
      myObserver.observe(item as Element)
    })

    return () => {
      // Clean up event listeners
      scrollAreaNode.removeEventListener('scroll', handleMainScroll)
      window.removeEventListener('resize', updateScrolling)
      window.removeEventListener('resize', updateSyncScrollbarPosition)
    }
  }, [handleMainScroll, updateScrolling, updateSyncScrollbarPosition, myObserver, children])

  // Set up sync scrollbar
  React.useEffect(() => {
    if (!syncScrollbar.current) return

    const syncScrollbarNode = syncScrollbar.current
    syncScrollbarNode.addEventListener('scroll', handleSyncScroll)

    return () => {
      syncScrollbarNode.removeEventListener('scroll', handleSyncScroll)
    }
  }, [handleSyncScroll])

  // Update sync scrollbar content width when main content changes
  React.useEffect(() => {
    if (!scrollArea.current || !syncScrollbar.current) return

    const updateSyncScrollbarWidth = () => {
      if (!scrollArea.current || !syncScrollbar.current) return

      const mainScrollWidth = scrollArea.current.scrollWidth
      const syncContent = syncScrollbar.current.querySelector('.sync-content') as HTMLDivElement

      if (syncContent) {
        syncContent.style.width = `${mainScrollWidth}px`
      }
    }

    // Update immediately
    updateSyncScrollbarWidth()

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updateSyncScrollbarWidth()
      updateSyncScrollbarPosition()
    })
    resizeObserver.observe(scrollArea.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [children, updateSyncScrollbarPosition])

  const RollingContainerScrollBar = React.useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <div ref={RollingContainerScrollBarRef}>{children}</div>
    ),
    [],
  )

  return (
    <Root
      className={clsx(
        className,
        scrolling.atStart ? 'atStart' : undefined,
        scrolling.atEnd ? 'atEnd' : undefined,
      )}
    >
      <div ref={scrollArea} className="scrollbar">
        {typeof children === 'function' ? children(RollingContainerScrollBar) : children}
      </div>

      {showSyncScrollbar && (
        <div
          ref={syncScrollbar}
          className="scrollbar"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: syncScrollbarPosition === 'under-chart' ? syncScrollbarTop - 8 : 'auto',
            bottom: syncScrollbarPosition === 'bottom' ? 0 : 'auto',
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
      )}
    </Root>
  )
}
