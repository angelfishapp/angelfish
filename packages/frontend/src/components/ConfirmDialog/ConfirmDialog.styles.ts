import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * ConfirmDialog Component Styles
 */

type StyleProps = {
  confirmButtonColor?: string
}

export const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  confirmButton: {
    backgroundColor: ({ confirmButtonColor }) => {
      return confirmButtonColor
        ? confirmButtonColor == 'primary'
          ? theme.palette.primary.main
          : theme.palette.error.light
        : undefined
    },
  },
}))
