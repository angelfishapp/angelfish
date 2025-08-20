import styled from '@emotion/styled'

interface RootProps {
  dir?: 'ltr' | 'rtl'
}

/**
 * Root of Container (LTR/RTL friendly via prop)
 */
export const Root = styled('div')<RootProps>(({ dir = 'ltr' }) => ({
  position: 'relative',
  'border-bottom-left-radius': 20,
  'border-bottom-right-radius': 20,

  '& > div': {
    width: '100%',
    overflowX: 'auto',

    '&::-webkit-scrollbar': {
      width: '7px',
      height: '7px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    '&::-webkit-scrollbar-thumb:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  },

  '& .isPinned': {
    position: 'sticky',

    '&::after': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      content: "''",
      width: '0px',
      transition: 'box-shadow .25s ease-in-out, width .25s ease-in-out',
    },

    '&.left': {
      insetInlineStart: 0,
      zIndex: 10,
      '&::after': {
        insetInlineEnd: 0,
        boxShadow: 'none',
      },
    },
  },

  '&::before, &::after': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1,
    width: '15px',
    boxShadow: 'none',
    transition: 'box-shadow .25s ease-in-out, width .25s ease-in-out',
  },

  '&::before': {
    insetInlineStart: 0,
  },

  '&::after': {
    insetInlineEnd: 0,
  },

  '&:not(.atStart)': {
    '&::before': {
      boxShadow: 'inset rgb(0 0 0 / 50%) 7px 0 7px 0px',
      zIndex: 11,
    },
    '& .isPinned.left::after': {
      boxShadow: 'rgb(0 0 0 / 50%) 7px 0 7px 0px',
      width: 7,
    },
  },

  '&:not(.atEnd)': {
    '&::after': {
      boxShadow:
        dir === 'ltr'
          ? 'inset rgb(0 0 0 / 50%) -7px 0 7px 0px'
          : 'inset rgb(0 0 0 / 50%) 7px 0 7px 0px',
    },
  },
}))
