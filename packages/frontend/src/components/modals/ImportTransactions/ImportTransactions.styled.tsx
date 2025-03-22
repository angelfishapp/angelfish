import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * ImportTransactions Component Styles
 */
export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  mapperHeadings: {
    margin: 0,
    height: 45,
    color: theme.palette.primary.main,
  },
}))
