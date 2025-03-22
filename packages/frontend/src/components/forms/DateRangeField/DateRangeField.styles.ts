import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * DateRangeField Component Styles
 */

type StyleProps = {
  border: boolean
}

export const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  textField: {
    height: 50,
    minWidth: 250,
    backgroundColor: theme.palette.common.white,
    borderRadius: 8,
    border: ({ border }) => (border ? `1px solid ${theme.custom.colors.inputUnfocused}` : 'none'),
    display: 'inline-flex',
    cursor: 'pointer !important',
    '&.Mui-focused': {
      border: ({ border }) => (border ? `1px solid ${theme.custom.colors.inputFocused}` : 'none'),
    },
    '&.Mui-error': {
      border: ({ border }) => (border ? `1px solid ${theme.palette.error.main}` : 'none'),
    },
    '& .MuiInputAdornment-positionEnd': {
      paddingRight: 14,
    },
    '& input': {
      padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
    },
  },
  paper: {
    padding: 0,
    borderRadius: 8,
  },
}))
