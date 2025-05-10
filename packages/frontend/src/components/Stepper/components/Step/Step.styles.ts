import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

/**
 * Step Component Styles
 */

export const StepPanelContainer = styled(Paper)(({ theme }) => ({
  minHeight: 200,
  width: '100%',
  padding: 15,

  // Target <p> elements that are NOT MUI Typography
  '& p:not(.MuiTypography-root)': {
    margin: '0px 0px 10px 0px',
  },

  // Scoped styles for nested elements
  '.header': {
    margin: 0,
    fontWeight: 'bold',
    height: 50,
  },

  '.button': {
    width: '50%',
  },

  '.cancelButton': {
    width: 150,
    marginRight: theme.spacing(2),
  },
}))
