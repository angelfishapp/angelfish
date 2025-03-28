import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'

/**
 * FilterButton Component Styles
 */

type FilterButtonProps = {
  filtered?: boolean
}

export const StyledFilterButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'filtered',
})<FilterButtonProps>(({ theme, filtered }) => ({
  display: 'flex',
  height: 48,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 9999,
  fontSize: '1rem',
  fontWeight: 'bold',
  color: filtered ? theme.palette.common.black : theme.palette.grey[600],
  lineHeight: 1,
  padding: theme.spacing(1, 2.5),
  textAlign: 'center',
}))
