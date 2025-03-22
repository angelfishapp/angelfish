import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * TextField Component Styles
 */

type StyleProps = {
  showValue: boolean
  multiline: boolean
}

export const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  textField: {
    height: ({ multiline }) => (multiline ? undefined : 50),
    backgroundColor: theme.palette.common.white,
    borderRadius: 8,
    border: `1px solid ${theme.custom.colors.inputUnfocused}`,
    display: ({ showValue }) => (showValue ? 'none' : 'inline-flex'),
    '&.Mui-focused': {
      border: `1px solid ${theme.custom.colors.inputFocused}`,
    },
    '&.Mui-error': {
      border: `1px solid ${theme.palette.error.main}`,
    },
    '& .MuiInputAdornment-positionStart': {
      paddingLeft: 14,
    },
    '& .MuiInputAdornment-positionEnd': {
      paddingRight: 14,
    },
    '& input, textarea': {
      padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
    },
  },
  valueRender: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 8,
    border: `1px solid ${theme.custom.colors.inputUnfocused}`,
    padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
    display: ({ showValue }) => (showValue ? 'block' : 'none'),
    cursor: 'pointer',
  },
}))
