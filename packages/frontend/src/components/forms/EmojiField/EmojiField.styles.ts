import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  emojiFieldIcon: {
    width: 35,
    height: 35,
    padding: 0,
    borderRadius: '50%',
  },
}))
