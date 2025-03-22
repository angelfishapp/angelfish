import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * AutocompleteField Component Styles
 */

export const useStyles = makeStyles<Theme>(() => ({
  autocompletePaper: {
    padding: 0,
    borderRadius: 8,
  },
  endAdornment: {
    top: 'calc(50% - 14px)',
    right: 9,
    position: 'absolute',
  },
  loadingIndicator: {
    top: 'calc(50% - 10px)',
    right: 35,
    position: 'absolute',
  },
}))
