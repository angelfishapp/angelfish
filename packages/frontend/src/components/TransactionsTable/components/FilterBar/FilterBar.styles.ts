import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * FilterBar Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  actionButton: {
    backgroundColor: theme.palette.primary.main,
    width: 48,
    height: 48,
    padding: 0,
    boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
    '&:hover': { backgroundColor: theme.palette.primary.light },
    '& svg': {
      fill: '#FFF',
      width: 45,
      height: 45,
    },
    '&.settingsButton': {
      backgroundColor: theme.palette.common.white,
      '&:hover': { backgroundColor: theme.palette.common.white },
      '& svg': {
        fill: theme.palette.primary.main,
      },
    },
  },
  showFilterButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  showFilterButtonActive: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    color: theme.palette.common.white,
  },
  filterIcon: {
    width: 18,
    height: 18,
    backgroundImage: `url(/assets/svg/filter.svg)`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  filterBar: {
    display: 'flex',
    flexGrow: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 9999,
  },
  divVertical: {
    width: 1,
    height: 'calc(100% - 16px)',
    backgroundColor: `${theme.palette.grey[500]} !important`,
    margin: '8px 0',
  },
}))
