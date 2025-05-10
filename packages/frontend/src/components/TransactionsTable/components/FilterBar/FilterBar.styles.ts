import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import { DropdownMenuButton } from '@/components/DropdownMenuButton'

/**
 * FilterBar Component Styles
 */

export const StyledFilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  height: 48,
  backgroundColor: '#fff',
  borderRadius: 9999,
  '& .divVertical': {
    width: 1,
    height: 'calc(100% - 16px)',
    backgroundColor: `${theme.palette.grey[500]} !important`,
    margin: '8px 0',
  },
}))

export const StyledActionButton = styled(IconButton)(({ theme }) => ({
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
}))

export const StyledSettingsButton = styled(DropdownMenuButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  width: 48,
  height: 48,
  padding: 0,
  boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
  '&:hover': { backgroundColor: theme.palette.common.white },
  '& svg': {
    fill: theme.palette.primary.main,
    width: 45,
    height: 45,
  },
}))
