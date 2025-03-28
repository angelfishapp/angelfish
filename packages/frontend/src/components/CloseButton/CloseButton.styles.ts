import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

/**
 * CloseButton Component Styles
 */

type StyleProps = {
  small?: boolean
}

export const StyledButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'small',
})<StyleProps>(({ theme, small }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: small ? 25 : 40,
  height: small ? 25 : 40,
  padding: 4,
  boxShadow:
    '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}))
