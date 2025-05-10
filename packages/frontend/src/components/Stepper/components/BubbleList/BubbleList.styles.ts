import { styled } from '@mui/material/styles'

/**
 * BubbleList Component Styles
 */

export const BubbleListContainer = styled('ol')(() => ({
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
  zIndex: -1,
}))
