import CloseIcon from '@mui/icons-material/Close'

import type { CloseButtonProps } from './CloseButton.interface'
import { StyledButton } from './CloseButton.styles'

/**
 * Renders a Close Button Icon
 */
export default function CloseButton({ small, className, ...buttonProps }: CloseButtonProps) {
  return (
    <StyledButton className={className} {...buttonProps} small={small} size="large">
      <CloseIcon />
    </StyledButton>
  )
}
