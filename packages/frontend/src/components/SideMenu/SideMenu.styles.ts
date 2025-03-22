import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * SideMenu Component Styles
 */

// Default Minimum width of the SideMenu
export const MIN_WIDTH = 350
// Default Maximum width of the SideMenu
export const MAX_WIDTH = 500
// Default width of the SideMenu when collapsed
export const COLLAPSED_WIDTH = 10

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  sidebarWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    transition: 'margin 300ms ease-in-out',
  },
  resizeBar: {
    top: 0,
    bottom: 0,
    right: 0,
    transform: 'translateX(50%)',
    zIndex: 99,
    position: 'absolute',
    width: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      '& $collapseButton': {
        visibility: 'visible',
      },
    },
  },
  paper: {
    padding: '0 !important',
    left: theme.spacing(2),
    minHeight: 100,
  },
  collapseButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    visibility: 'hidden',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  children: {
    transition: 'opacity 500ms linear',
  },
}))
