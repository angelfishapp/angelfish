import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import type { FC } from 'react'

import type { ConfirmDialogProps } from './ConfirmDialog.interface'
import { StyledCloseButton, StyledConfirmButton } from './ConfirmDialog.styles'

/**
 * Displays Confirm Dialog to Confirm or Cancel An Action
 */

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  autoFocus = true,
  cancelText = 'Cancel',
  children,
  confirmButtonColor,
  confirmButtonDisabled = false,
  confirmText = 'OK',
  onClose,
  onConfirm,
  open = false,
  title,
}) => {
  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography sx={{ typography: 'h5' }}>{title}</Typography>
        <StyledCloseButton onClick={onClose} size="small" />
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <StyledConfirmButton
          onClick={onConfirm}
          confirmButtonColor={confirmButtonColor}
          autoFocus={autoFocus}
          disabled={confirmButtonDisabled}
        >
          {confirmText}
        </StyledConfirmButton>
      </DialogActions>
    </Dialog>
  )
}
