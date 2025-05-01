import { CircularProgress } from '@mui/material'
import type { LoadingSPinnerProps } from './LoadingSPinner.interface'
import { Container } from './LoadingSpinner.style'

/**
 * Loading Spinner Component
 * Displays a loading spinner while data is being fetched
 * and centers it in the parent container
 * @returns {JSX.Element} Loading Spinner Component
 *
 */
export default function LoadingSpinner({ size, color }: LoadingSPinnerProps) {
  return (
    <Container>
      <CircularProgress size={size} color={color} />
    </Container>
  )
}
