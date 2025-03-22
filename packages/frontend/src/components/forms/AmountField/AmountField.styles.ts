import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * AmountField Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  currencySymbol: {
    '& p': {
      fontSize: theme.typography.h5.fontSize,
    },
  },
}))
