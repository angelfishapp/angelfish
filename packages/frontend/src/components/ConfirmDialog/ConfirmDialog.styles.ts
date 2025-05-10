import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import { CloseButton } from '@/components/CloseButton'

/**
 * ConfirmDialog Component Styles
 */

type StyleProps = {
  confirmButtonColor?: 'primary' | 'error'
}

// Close Button (absolute position)
export const StyledCloseButton = styled(CloseButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}))

// Confirm Button (dynamic background color)
export const StyledConfirmButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'confirmButtonColor',
})<StyleProps>(({ theme, confirmButtonColor }) => ({
  backgroundColor:
    confirmButtonColor === 'primary'
      ? theme.palette.primary.main
      : confirmButtonColor === 'error'
        ? theme.palette.error.light
        : undefined,
}))
