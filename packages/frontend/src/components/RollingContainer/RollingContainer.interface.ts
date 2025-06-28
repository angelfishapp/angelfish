import type { JSX, ReactNode } from 'react'

/**
 * Props for the RollingContainer component.
 */
export interface RollingContainerProps {
  /**
   * Optional class name to apply to the container.
   */
  className?: string

  /**
   * A render prop that receives a `createScrollBar` function and returns React children.
   *
   * @param createScrollBar - Function to create a scrollable container by ID.
   */
  children: (
    createScrollBar: (id: string) => ({ children }: { children: ReactNode }) => JSX.Element,
  ) => ReactNode

  /**
   * Whether to show a synchronized scrollbar.
   */
  showSyncScrollbar?: boolean

  /**
   * The vertical position of the synchronized scrollbar.
   * - `"original"`: Displays the scrollbar at the bottom.
   * - `"external"`: Displays the scrollbar below a chart (if applicable).
   */
  syncScrollbarPosition?: 'original' | 'external'
}

/**
 * Information about a single scroll bar instance.
 */
export interface ScrollBarInfo {
  /**
   * Unique identifier for the scrollbar.
   */
  id: string

  /**
   * The DOM reference to the scrollbar container element.
   */
  ref: HTMLDivElement | null

  /**
   * The vertical scroll position of the scrollbar.
   */
  top: number
}
