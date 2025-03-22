import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * BubbleStep Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  step: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  bubble: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    transform: 'scale(0)',
    transition: 'transform 1s ease',
  },
  done: {
    '&  $number': {
      opacity: 0,
    },
  },
  animationWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'scale(1)',
    transition: 'transform 1s ease .3s',
    width: '64px !important',
    height: '64px !important',
    marginRight: 4,

    '& > svg': {
      width: '64px !important',
      height: '64px !important',
      position: 'absolute',
      inset: 0,
    },

    '& ~ $number': {
      marginLeft: 4,
      opacity: 1,
    },
  },
  number: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 1,
    transition: 'opacity .3s ease',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 1,
    transition: 'opacity .3s ease, font 0.3s ease',
  },
  active: {
    '& $animationWrapper': {
      transform: 'scale(1.65)',
    },
    '& $label': {
      fontSize: 24,
    },
  },
}))
