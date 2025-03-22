import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * AppLayout Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  container: {
    maxWidth: '100vw',
    maxHeight: '100vh',
    top: 0,
    left: 0,
  },
  page: {
    marginLeft: theme.custom.side.width,
    position: 'absolute',
    top: 0,
    left: 0,
    width: `calc(100vw - ${theme.custom.side.width}px)`,
    height: '100vh',
    overflow: 'auto',
  },
}))
