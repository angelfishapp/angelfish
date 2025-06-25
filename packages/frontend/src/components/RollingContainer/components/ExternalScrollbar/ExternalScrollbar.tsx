import type { FC } from 'react'

import { Box } from '@mui/material'

import type { RefObject } from 'react'

/**
 * Props for the ExternalScrollbar component.
 */
export interface ExternalScrollbarProps {
  /**
   * The vertical position of the scrollbar within the parent container.
   * Can be a number (pixels) or a CSS string (e.g., '2rem', '10%').
   */
  top: number | string

  /**
   * A reference to the main scrollable container that this scrollbar syncs with.
   * Can be a RefObject or a callback ref.
   */
  scrollAreaRef: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void)

  /**
   * A shared RefObject that holds an array of scrollbar DOM elements,
   * used to programmatically access each scrollbar by its index.
   */
  refs: RefObject<HTMLDivElement[]>

  /**
   * The index of this scrollbar in the shared `refs` array.
   */
  index: number
}

/**
 * A reusable external scrollbar that stays positioned absolutely
 * and syncs horizontally with a scrollable area.
 */
export const ExternalScrollbar: FC<ExternalScrollbarProps> = ({
  top,
  scrollAreaRef,
  index,
  refs,
}) => {
  return (
    <Box
      ref={(el: HTMLDivElement | null) => {
        if (el) refs.current[index] = el
      }}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height: 16,
        overflowX: 'auto',
        overflowY: 'hidden',
        zIndex: 12,
        pointerEvents: 'auto',
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          width:
            typeof scrollAreaRef === 'object' &&
            scrollAreaRef !== null &&
            'current' in scrollAreaRef
              ? scrollAreaRef.current?.scrollWidth || '100%'
              : '100%',
          height: 1,
        }}
      />
    </Box>
  )
}
