import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * ColorField Component Styles
 */

type StyleProps = {
  colorValue?: string
}

export const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  colorField: {
    width: 32,
    height: 32,
    border: `1px solid ${theme.custom.colors.inputUnfocused}`,
    borderRadius: '50%',
    backgroundColor: ({ colorValue }) => colorValue,
    '&:hover': {
      backgroundColor: ({ colorValue }) => colorValue,
      border: `1px solid ${theme.custom.colors.inputFocused}`,
    },
  },
}))
