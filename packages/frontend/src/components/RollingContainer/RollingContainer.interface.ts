import type { ReactNode } from 'react'

/**
 * Props for the RollingContainer component.
 */
export interface RollingContainerProps {
  /**
   * Optional custom class name for the container.
   */
  className?: string

  /**
   * Child components to render inside the scrollable container.
   */
  children: ReactNode

  /**
   * Whether to show synchronized scrollbars.
   * @default true
   */
  showSyncScrollbar?: boolean

  /**
   * Positioning mode for the synchronized scrollbars.
   * - "original": attached to bottom of the content.
   * - "external": absolutely positioned outside the content flow.
   * @default "original"
   */
  syncScrollbarPosition?: 'original' | 'external'
}

/**
 * Props for the RollingContainerScrollBar component.
 */
export interface RollingContainerScrollBarProps {
  /**
   * Unique identifier used to register the scrollbar within the container context.
   */
  id: string
}

/**
 * Metadata for a registered scrollbar element.
 */
export interface ScrollBarInfo {
  /**
   * Unique identifier of the scrollbar.
   */
  id: string

  /**
   * Reference to the HTML element representing the scrollbar.
   */
  ref: HTMLDivElement | null

  /**
   * The calculated top offset position (used for absolute positioning).
   */
  top: number
}

/**
 * Context type used by RollingContainer to coordinate scrollbar synchronization.
 */
export interface RollingContainerContextType {
  /**
   * Registers a scrollbar by ID and DOM ref, enabling synchronization.
   *
   * @param id - Unique identifier for the scrollbar.
   * @param ref - Reference to the scrollbar container element.
   */
  registerScrollBar: (id: string, ref: HTMLDivElement | null) => void

  /**
   * Unregisters a scrollbar by ID and removes it from sync tracking.
   *
   * @param id - Unique identifier of the scrollbar to unregister.
   */
  unregisterScrollBar: (id: string) => void

  /**
   * Collection of all registered scrollbars with their positioning info.
   */
  scrollBarInfo: Map<string, ScrollBarInfo>

  /**
   * Positioning mode for synchronized scrollbars.
   */
  syncScrollbarPosition: 'original' | 'external'

  /**
   * Indicates whether to render synchronized scrollbars.
   */
  showSyncScrollbar: boolean
}
