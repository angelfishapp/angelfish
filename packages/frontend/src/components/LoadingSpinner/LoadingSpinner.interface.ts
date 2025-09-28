import type { CircularProgressProps } from '@mui/material/CircularProgress'

/**
 * LoadingSpinner Component Properties
 */
export interface LoadingSpinnerProps {
  /**
   * Component Color.
   * @default 'primary'
   */
  color?: CircularProgressProps['color']
  /**
   * Component size.
   * @default '40px'
   */
  size?: CircularProgressProps['size']
  /**
   * Variant of the loading spinner.
   * @default 'circular'
   */
  variant?: 'circular' | 'linear'
  /**
   * Progress value for linear variant (0-100).
   * @default 100
   */
  progress?: number
}
