import { styled } from '@mui/material/styles'

/**
 * Dashboard Chart Component Styles
 */

export const StyledHeader = styled('h1')(() => ({
  position: 'relative',
  '&::after': {
    position: 'absolute',
    display: 'inline-block',
    height: '1rem',
    width: '100%',
    left: 0,
    bottom: '-0.5rem',
    content: '""',
    backgroundImage: 'url("assets/svg/underline_white.svg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 10,
  },
}))
