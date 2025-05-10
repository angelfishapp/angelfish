import { styled } from '@mui/material/styles'

/**
 * BubbleStep Component Styles
 */

export const BubbleStepContainer = styled('li')(() => ({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',

  // .bubble
  '.bubble': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    transform: 'scale(0)',
    transition: 'transform 1s ease',
  },

  // .animationWrapper
  '.animationWrapper': {
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

    '& ~ .number': {
      marginLeft: 4,
      opacity: 1,
    },
  },

  // .number
  '.number': {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 1,
    transition: 'opacity .3s ease',
  },

  // .label
  '.label': {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 1,
    transition: 'opacity .3s ease, font 0.3s ease',
  },

  // .done modifier
  '&.done': {
    '.number': {
      opacity: 0,
    },
  },

  // .active modifier
  '&.active': {
    '.animationWrapper': {
      transform: 'scale(1.65)',
    },
    '.label': {
      fontSize: 24,
    },
  },
}))
