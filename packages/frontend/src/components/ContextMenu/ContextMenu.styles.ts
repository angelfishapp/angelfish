import { styled } from '@mui/material/styles'

/**
 * Main ContextMenu
 */
export const StyledContextMenu = styled('ul')(({ theme }) => ({
  '&, & ul': {
    position: 'fixed',
    zIndex: theme.zIndex.modal + 10,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    transition:
      'opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    opacity: 0,
    borderRadius: 8,
    boxShadow: theme.shadows[8],
    minWidth: 200,
    minHeight: 16,
    listStyle: 'none',
    outline: 0,
    margin: 0,
    paddingInlineStart: 0,
    '&.flowRight li > ul': {
      left: 'auto',
      right: '100%',
    },
    '&.flowUp li > ul': {
      top: 'auto',
      bottom: 0,
    },
    '& li': {
      position: 'relative',
      padding: 10,
      cursor: 'pointer',
      userSelect: 'none',
      verticalAlign: 'middle',
      '& ul': {
        position: 'absolute',
        display: 'none',
        top: 0,
        left: '100%',
        marginLeft: -8,
        marginTop: -1,
        cursor: 'default',
      },
      '&:hover:not(.title), &.isOpen': {
        '& > ul': {
          display: 'block',
          opacity: 1,
        },
      },
      '&:hover:not(.title)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:has(ul):not(.disabled)': {
        '& p': {
          display: 'inline-block',
          maxWidth: 'calc(100% - 30px)',
          verticalAlign: 'top',
        },
        '&::after': {
          content: '"▶"',
          float: 'right',
          marginLeft: 10,
        },
      },
      '& p': {
        margin: 0,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '&.title': {
        cursor: 'default',
        overflow: 'hidden',
        '& p': {
          fontWeight: 'bold',
          lineHeight: 1.5,
        },
      },
      '&.disabled': {
        opacity: 0.38,
        cursor: 'default',
        '& > ul': {
          display: 'none !important',
          opacity: '0 !important',
        },
      },
    },
  },
}))
