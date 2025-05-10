import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

/**
 * AvatarDialog Component Styles
 */

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: 'pointer',
  transform: 'scale(0.7)',
  transition: 'transform 0.2s ease',

  '&:hover': {
    transform: 'scale(1)',
  },

  '&.selected': {
    transform: 'scale(1)',
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: '0 4px 2px 2px #c5d2db',
  },

  '&.upload': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
}))
