import type { ReactNode } from 'react'

/**
 * RollingContainer Component Properties
 */

export interface RollingContainerProps {
  /**
   * additional className for container
   *
   * @type {?string}
   */
  className?: string
  /**
   * children to be placed inside container
   *
   * @type {(ReactNode | ReactNode[])}
   */
  children: ReactNode | ReactNode[]
}
