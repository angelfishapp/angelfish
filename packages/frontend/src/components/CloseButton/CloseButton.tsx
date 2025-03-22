import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import type { CloseButtonProps } from './CloseButton.interface'
import { useStyles } from './CloseButton.styles'

/**
 * Renders a Close Button Icon
 */
export default function CloseButton({ small, className, ...buttonProps }: CloseButtonProps) {
  const classes = useStyles({ small })

  return (
    <IconButton className={clsx(classes.closeButton, className)} {...buttonProps} size="large">
      <CloseIcon />
    </IconButton>
  )
}
