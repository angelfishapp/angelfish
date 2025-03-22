import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * FormField Component Styles
 */

type StyleProps = {
  margin: 'none' | 'dense' | 'normal'
}

export const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  formField: {
    marginBottom: ({ margin }) => (margin == 'normal' ? 15 : margin == 'dense' ? 5 : 0),
  },
  formLabel: {
    fontWeight: 600,
    color: theme.palette.common.black,
    marginBottom: 10,
    '&.Mui-focused': {
      color: theme.custom.colors.inputFocused,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}))
