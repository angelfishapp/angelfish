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

  // When scroll has moved past start of rolling container
  '&:not(.atStart)': {
    // Show shadow effect on left of rolling container
    '&::before': {
      boxShadow: 'inset rgb(0 0 0 / 50%) 7px 0 7px 0px',
      zIndex: 11,
    },

    // Show shadow effect on right of pinned column
    '& .isPinned.left::after': {
      boxShadow: 'rgb(0 0 0 / 50%) 7px 0 7px 0px',
      width: 7,
    },
  },

  // When scroll has moved to end of rolling container
  '&:not(.atEnd)': {
    // Show shadow effect on right of rolling container
    '&::after': {
      boxShadow: 'inset rgb(0 0 0 / 50%) -7px 0 7px 0px',
    },
  },
})
