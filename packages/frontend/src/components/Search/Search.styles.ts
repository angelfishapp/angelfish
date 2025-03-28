import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

/**
 * Search Component Styles
 */

type StyleProps = {
  hasShadow?: boolean
}

export const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasShadow',
})<StyleProps>(({ theme, hasShadow }) => ({
  display: 'flex',
  flexGrow: 1,
  backgroundColor: theme.palette.common.white,
  borderRadius: 9999,
  boxShadow: hasShadow ? '0 3px 10px rgba(0,0,0,0.25)' : 'none',
  overflow: 'hidden',
  height: 48,

  // input area inside
  '.searchInput': {
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
    padding: `0 ${theme.spacing(2)}`,
  },

  // button inside
  '.searchInputButton': {
    height: 48,
    width: 48,
    padding: 2,
  },
}))
