import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Reports Component Styles
 */

export const useStyles = makeStyles((theme: Theme) => ({
  reportsHeading: {
    color: theme.palette.common.white,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: '0 !important',
    overflow: 'hidden',
  },
}))
