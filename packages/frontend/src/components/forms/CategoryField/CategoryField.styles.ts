import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * CategoryField Component Styles
 */

export const useStyles = makeStyles<Theme>((theme) => ({
  descriptionTooltip: {
    maxWidth: 200,
    backgroundColor: theme.palette.grey[400],
    fontSize: '1em',
  },
}))
