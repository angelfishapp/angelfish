import ListItemButton from '@mui/material/ListItemButton'
import { styled } from '@mui/material/styles'

/**
 * Styled ListItemButton
 */
export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    zIndex: 1,
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '& .MuiListItemText-secondary': {
      color: `${theme.palette.common.white}`,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      boxShadow: `0 6px 12px 0 ${theme.palette.grey[600]}`,
    },
  },
}))
