import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * CategoryGroupField Component Styles
 */

export const useStyles = makeStyles<Theme>((theme) => ({
  emojiIcon: {
    height: 24,
    marginRight: theme.spacing(1),
    '& .emoji-mart-emoji': {
      height: 25,
    },
  },
  name: {
    height: 24,
  },
  selectMenu: {
    verticalAlign: 'middle',
  },
}))
