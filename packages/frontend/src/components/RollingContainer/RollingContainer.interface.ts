import type { ReactNode } from 'react'

/**
 * Props for the RollingContainer component.
 */
export interface RollingContainerProps {
  /**
   * Optional CSS class name to apply to the root container.
   */
  className?: string

  /**
   * Child elements to be rendered inside the container.
   */
  children: ReactNode | ReactNode[]

  /**
   * Optional array of external scrollbars, each with a vertical `top` position.
   * If provided, each scrollbar will be rendered at the specified position and
   * synchronized with the main scrollable content.
   */
  scrollbars?: {
    /**
     * Vertical position of the scrollbar (e.g., number in pixels or a string like '2rem').
     */
    top: number | string
  }[]
}
