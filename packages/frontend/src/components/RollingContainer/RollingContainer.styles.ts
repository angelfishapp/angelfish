import styled from '@emotion/styled'

/**
 * Root of Container
 */
export const Root = styled('div')({
  position: 'relative',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,

  '& > div': {
    width: '100%',
    overflowX: 'auto',

    '&::-webkit-scrollbar': {
      width: '7px',
      height: '7px',
      backgroundColor: 'transparent',
    },

    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },

    '&::-webkit-scrollbar-track:hover': {
      backgroundColor: 'transparent',
    },

    '&::-webkit-scrollbar-track:active': {
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
      left: 0,
      zIndex: 10,
      '&::after': {
        boxShadow: 'none',
        right: 0,
      },
    },
  },

  '&::before,&::after': {
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
    left: 0,
  },

  '&::after': {
    right: 0,
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
      boxShadow: 'inset rgb(0 0 0 / 50%) -7px 0 7px 0px',
    },
  },
})
