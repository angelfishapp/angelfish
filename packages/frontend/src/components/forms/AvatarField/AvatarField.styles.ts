import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'

/**
 * AvatarField Component Styles
 */

type StyleProps = {
  size: number
}

export const StyledAvatarBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'size',
})<StyleProps>(({ size }) => ({
  display: 'inline-flex',
  position: 'relative',
  flexShrink: 0,
  verticalAlign: 'middle',
  cursor: 'pointer',
  width: size,
  '& .MuiBadge-badge': {
    display: 'flex',
    padding: 3,
    zIndex: 1,
    position: 'absolute',
    borderRadius: '50%',
    width: 'auto',
    height: 'auto',
  },
}))
