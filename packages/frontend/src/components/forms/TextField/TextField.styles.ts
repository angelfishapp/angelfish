import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'

/**
 * TextField Component Styles
 */

type StyleProps = {
  multiline: boolean
}

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'multiline',
})<StyleProps>(({ theme, multiline }) => ({
  height: multiline ? undefined : 50,
  backgroundColor: theme.palette.common.white,
  borderRadius: 8,
  border: `1px solid ${theme.custom.colors.inputUnfocused}`,

  '&.Mui-focused': {
    border: `1px solid ${theme.custom.colors.inputFocused}`,
  },

  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
  },

  '& .MuiInputAdornment-positionStart': {
    paddingLeft: 14,
  },

  '& .MuiInputAdornment-positionEnd': {
    paddingRight: 14,
  },

  '& input, textarea': {
    padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
  },
}))
