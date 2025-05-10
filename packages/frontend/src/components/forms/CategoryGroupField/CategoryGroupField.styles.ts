import { styled } from '@mui/material/styles'

/**
 * CategoryGroupField Component Styles
 */

export const StyledEmojiIcon = styled('span')(({ theme }) => ({
  height: 24,
  marginRight: theme.spacing(1),
  '& .emoji-mart-emoji': {
    height: 25,
  },
}))
