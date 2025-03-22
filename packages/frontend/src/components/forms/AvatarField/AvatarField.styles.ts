import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * AvatarField Component Styles
 */

type StyleProps = {
  size: number
}

export const useStyles = makeStyles<Theme, StyleProps>(() => ({
  badgeRoot: {
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
    cursor: 'pointer',
    width: ({ size }) => size,
  },
  badge: {
    display: 'flex',
    padding: 3,
    zIndex: 1,
    position: 'absolute',
    borderRadius: '50%',
    width: 'auto',
    height: 'auto',
  },
}))
