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
export const RollingContainer: FC<RollingContainerProps> = ({ className, children }) => {
  // setup scrolling detection
  const scrollArea = React.useRef<HTMLDivElement | null>(null)
  const [scrolling, setScrolling] = React.useState<{ atStart?: boolean; atEnd?: boolean }>({
    atStart: true,
    atEnd: true,
  })

  const updateScrolling = React.useCallback(() => {
    if (!scrollArea?.current) return
    const start = isScrolledToStart(scrollArea.current, 10)
    const end = isScrolledToEnd(scrollArea.current, 10)

    // if scrolled value is different
    if (start !== scrolling.atStart || end !== scrolling.atEnd) {
      setScrolling(() => ({ atStart: start, atEnd: end }))
    }
  }, [scrolling.atEnd, scrolling.atStart])

  // this will get called whenever div dimension changes
  const myObserver = React.useMemo(
    () =>
      new ResizeObserver(() => {
        if (!scrollArea?.current) return
        // should update where the scroll is on first render
        setTimeout(() => updateScrolling(), 250)
      }),
    [updateScrolling],
  )

  // detect scrolled position
  React.useEffect(() => {
    if (!scrollArea?.current) return
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
      // scrolled position might change on window resize
      window?.removeEventListener('resize', updateScrolling)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateScrolling, scrollArea.current, scrollArea.current?.childNodes.length])

  return (
    <Root
      className={clsx(
        className,
        scrolling.atStart ? 'atStart' : undefined,
        scrolling.atEnd ? 'atEnd' : undefined,
      )}
    >
      <div ref={scrollArea} className="scrollbar">
        {children}
      </div>
    </Root>
  )
}
