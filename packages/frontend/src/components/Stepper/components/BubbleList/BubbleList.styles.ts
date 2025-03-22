import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * BubbleList Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  bubbleList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    zIndex: -1,
  },
}))
