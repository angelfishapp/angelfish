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
}
