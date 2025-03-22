import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Step Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  stepPanel: {
    minHeight: 200,
    width: '100%',
    padding: 15,
    '& p:not(.MuiTypography-root)': {
      margin: '0px 0px 10px 0px',
    },
  },
  header: {
    margin: 0,
    fontWeight: 'bold',
    height: 50,
  },
  button: {
    width: '50%',
  },
  cancelButton: {
    width: 150,
    marginRight: theme.spacing(2),
  },
}))
