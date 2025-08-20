import { styled } from '@mui/material/styles'

interface SideBarWrapperProps {
  dir?: 'ltr' | 'rtl'
}

/**
 * SideMenu Component Styles
 */
export const MIN_WIDTH = 350
export const MAX_WIDTH = 500
export const COLLAPSED_WIDTH = 10

export const SideBarWrapper = styled('div')<SideBarWrapperProps>(({ dir = 'ltr' }) => ({
  position: 'relative',
  alignSelf: 'flex-start',
  display: 'flex',
  flexDirection: 'row',
  transition: 'margin 300ms ease-in-out',

  '& .resizeBar': {
    top: 0,
    bottom: 0,
    right: dir === 'ltr' ? 0 : 'auto',
    left: dir === 'rtl' ? 0 : 'auto',
    transform: dir === 'ltr' ? 'translateX(50%)' : 'translateX(-50%)',
    zIndex: 99,
    position: 'absolute',
    width: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      '& .collapseButton': {
        visibility: 'visible',
      },
    },
  },
}))
