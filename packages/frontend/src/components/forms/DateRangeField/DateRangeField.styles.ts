import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'

/**
 * DateRangeField Component Styles
 */

type StyleProps = {
  border: boolean
}

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'border',
})<StyleProps>(({ theme, border }) => ({
  height: 50,
  minWidth: 250,
  backgroundColor: theme.palette.common.white,
  borderRadius: 8,
  border: border ? `1px solid ${theme.custom.colors.inputUnfocused}` : 'none',
  display: 'inline-flex',
  cursor: 'pointer',

  '&.Mui-focused': {
    border: border ? `1px solid ${theme.custom.colors.inputFocused}` : 'none',
  },

  '&.Mui-error': {
    border: border ? `1px solid ${theme.palette.error.main}` : 'none',
  },

  '& .MuiInputAdornment-positionEnd': {
    paddingRight: 14,
  },

  '& input': {
    padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
  },
}))
