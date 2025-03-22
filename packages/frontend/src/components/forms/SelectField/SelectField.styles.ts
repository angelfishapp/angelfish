import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * SelectField Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  selectField: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 8,
    border: `1px solid ${theme.custom.colors.inputUnfocused}`,
    marginTop: '5px !important',
    padding: 5,
    '&.Mui-focused': {
      border: `1px solid ${theme.custom.colors.inputFocused}`,
    },
    '&.Mui-error': {
      border: `1px solid ${theme.palette.error.main}`,
    },
    '& input': {
      padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
    },
  },
}))
