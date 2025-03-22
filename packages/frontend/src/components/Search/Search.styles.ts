import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Search Component Styles
 */

type StyleProps = {
  hasShadow?: boolean
}

export const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  searchInput: {
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
    padding: `0 ${theme.spacing(2)}`,
  },
  searchInputWrapper: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
    borderRadius: 9999,
    boxShadow: ({ hasShadow }) => (hasShadow ? '0 3px 10px rgba(0,0,0,0.25)' : 'none'),
    overflow: 'hidden',
    height: 48,
  },
  searchInputButton: {
    height: 48,
    width: 48,
    padding: 2,
  },
}))
