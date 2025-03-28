import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

/**
 * ColorField Component Styles
 */

type StyleProps = {
  colorValue?: string
}

export const ColorFieldButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'colorValue',
})<StyleProps>(({ theme, colorValue }) => ({
  width: 32,
  height: 32,
  border: `1px solid ${theme.custom.colors.inputUnfocused}`,
  borderRadius: '50%',
  backgroundColor: colorValue,

  '&:hover': {
    backgroundColor: colorValue,
    border: `1px solid ${theme.custom.colors.inputFocused}`,
  },
}))
