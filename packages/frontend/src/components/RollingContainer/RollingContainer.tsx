import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import type { RollingContainerProps } from './RollingContainer.interface'
import { Root } from './RollingContainer.styles'
import { isScrolledToEnd, isScrolledToStart } from './RollingContainer.utils'
import { ExternalScrollbar } from './components/ExternalScrollbar/ExternalScrollbar'

/**
 * Provides RollingContainer component that displays shadow effects if the viewport shrinks below the size of the container to
 * give a scrolling effect inside the container like its rolling behind the background.
 */
export const RollingContainer: FC<RollingContainerProps> = ({
  className,
  children,
  scrollbars = [],
}) => {
  // setup scrolling detection
  const scrollArea = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const refs = React.useRef<HTMLDivElement[]>([])

  const [scrolling, setScrolling] = React.useState<{ atStart?: boolean; atEnd?: boolean }>({
    atStart: true,
    atEnd: true,
  })

  const updateScrolling = React.useCallback(() => {
    if (!scrollArea.current) return
    const start = isScrolledToStart(scrollArea.current, 10)
    const end = isScrolledToEnd(scrollArea.current, 10)
    if (start !== scrolling.atStart || end !== scrolling.atEnd) {
      setScrolling({ atStart: start, atEnd: end })
    }
  }, [scrolling.atStart, scrolling.atEnd])

  // this will get called whenever div dimension changes
  const myObserver = React.useMemo(
    () =>
      new ResizeObserver(() => {
        if (!scrollArea.current) return
        // should update where the scroll is on first render
        setTimeout(() => updateScrolling(), 250)
      }),
    [updateScrolling],
  )

  // detect scrolled position
  React.useEffect(() => {
    if (!scrollArea.current) return
    // should update where the scroll is on first render
    setTimeout(() => updateScrolling(), 250)
    // scrolled position will change on element scroll
    scrollArea.current.addEventListener('scroll', updateScrolling)
    // scrolled position might change on window resize
    window.addEventListener('resize', updateScrolling)

    scrollArea.current.childNodes.forEach((item) => {
      myObserver.observe(item as Element)
    })

    return () => {
      // scrolled position will change on element scroll
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollArea.current?.removeEventListener('scroll', updateScrolling)
      window.removeEventListener('resize', updateScrolling)
      // scrolled position might change on window resize
    }
  }, [updateScrolling, scrollArea.current?.childNodes.length, myObserver])

  // sync external scrollbars
  React.useEffect(() => {
    const scroll = scrollArea.current
    if (!scroll) return

    const handlers: (() => void)[] = []

    refs.current.forEach((el) => {
      if (!el) return

      const onScrollExternal = () => {
        scroll.scrollLeft = el.scrollLeft
      }

      const onScrollInternal = () => {
        el.scrollLeft = scroll.scrollLeft
      }

      el.addEventListener('scroll', onScrollExternal)
      scroll.addEventListener('scroll', onScrollInternal)

      handlers.push(() => {
        el.removeEventListener('scroll', onScrollExternal)
        scroll.removeEventListener('scroll', onScrollInternal)
      })
    })

    return () => {
      handlers.forEach((cleanup) => cleanup())
    }
  }, [scrollbars.length])

  return (
    <Root
      className={clsx(
        className,
        scrolling.atStart ? 'atStart' : undefined,
        scrolling.atEnd ? 'atEnd' : undefined,
      )}
      style={{ position: 'relative' }}
    >
      {scrollbars.map(({ top }, index) => (
        <ExternalScrollbar
          key={index}
          index={index}
          top={top}
          scrollAreaRef={scrollArea}
          refs={refs}
        />
      ))}

      <div
        ref={scrollArea}
        className="scrollbar"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {children}
      </div>
    </Root>
  )
}
