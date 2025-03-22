import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Chart Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  chartPaper: {
    height: 250,
    marginBottom: 20,
    padding: 10,
  },
}))
