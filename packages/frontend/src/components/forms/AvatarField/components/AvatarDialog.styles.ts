import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * AvatarDialog Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  dialog: {
    '& h2': {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
  },
  avatar: {
    cursor: 'pointer',
    transform: 'scale(0.7)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1)',
    },
    '&.selected': {
      transform: 'scale(1)',
      border: '2px solid ' + theme.palette.primary.main,
      boxShadow: '0 4px 2px 2px #c5d2db',
    },
  },
  upload: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
}))
