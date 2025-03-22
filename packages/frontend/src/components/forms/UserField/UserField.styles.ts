import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * UserField Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
}))
