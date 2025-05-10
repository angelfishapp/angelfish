import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'

/**
 * SelectField Component Styles
 */

export const StyledSelectField = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: 8,
  border: `1px solid ${theme.custom.colors.inputUnfocused}`,
  marginTop: '5px !important',
  padding: 5,

  '&.Mui-focused': {
    border: `1px solid ${theme.custom.colors.inputFocused}`,
  },

  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
  },

  '& input': {
    padding: `${theme.spacing(1.5)} ${theme.spacing(1.5)}`,
  },
}))
