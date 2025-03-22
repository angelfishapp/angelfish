import type { Theme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Component Styles
 */
export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  accountsHeading: {
    color: theme.palette.common.white,
  },
  currencyLabel: {
    display: 'inline',
    color: theme.palette.common.white,
    fontSize: theme.typography.h5.fontSize,
  },
}))
