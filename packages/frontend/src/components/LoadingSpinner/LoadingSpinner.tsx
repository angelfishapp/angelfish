import CircularProgress from '@mui/material/CircularProgress'

import type { LoadingSpinnerProps } from './LoadingSpinner.interface'
import { BorderLinearProgress, Container } from './LoadingSpinner.style'

/**
 * Loading Spinner Component
 * Displays a loading spinner while data is being fetched and centers it in the parent container
 */

export default function LoadingSpinner({
  size,
  color,
  variant,
  progress = 0,
}: LoadingSpinnerProps) {
  
  if (variant === 'linear') {
    return <BorderLinearProgress variant="determinate" value={progress} />
  }
  return (
    <Container>
      <CircularProgress size={size} color={color} />
    </Container>
  )
}
