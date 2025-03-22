import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * FilterButton Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  filterButton: {
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: theme.palette.grey[600],
    lineHeight: 1,
    padding: theme.spacing(1, 2.5),
    textAlign: 'center',
    '&.filtered': {
      color: theme.palette.common.black,
    },
  },
  dropDown: {
    minWidth: 250,
    padding: 0,
    zIndex: theme.zIndex.modal + 1,
  },
}))
