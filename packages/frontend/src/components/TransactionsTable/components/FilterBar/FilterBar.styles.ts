import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

/**
 * FilterBar Component Styles
 */

export const StyledFilterBar = styled(Box)(({ theme }) => ({
  '& .actionButton': {
    backgroundColor: theme.palette.primary.main,
    width: 48,
    height: 48,
    padding: 0,
    boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
    '&:hover': { backgroundColor: theme.palette.primary.light },
    '& svg': {
      fill: '#FFF',
      width: 45,
      height: 45,
    },
    '&.settingsButton': {
      backgroundColor: theme.palette.common.white,
      '&:hover': { backgroundColor: theme.palette.common.white },
      '& svg': {
        fill: theme.palette.primary.main,
      },
    },
  },
  '& .divVertical': {
    width: 1,
    height: 'calc(100% - 16px)',
    backgroundColor: `${theme.palette.grey[500]} !important`,
    margin: '8px 0',
  },
}))
