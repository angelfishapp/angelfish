import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Settings Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.common.white} !important`,
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  },
  page: {
    padding: '24px 16px',
    height: '100vh',
  },
}))
