import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'

/**
 * FormField Component Styles
 */

type StyleProps = {
  margin: 'none' | 'dense' | 'normal'
}

export const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== 'margin',
})<StyleProps>(({ theme, margin }) => ({
  marginBottom: margin === 'normal' ? 15 : margin === 'dense' ? 5 : 0,

  // Nested label styling
  '& .MuiFormLabel-root': {
    fontWeight: 600,
    color: theme.palette.common.black,
    marginBottom: 10,

    '&.Mui-focused': {
      color: theme.custom.colors.inputFocused,
    },

    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}))
