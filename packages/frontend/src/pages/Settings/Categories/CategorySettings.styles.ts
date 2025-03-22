import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * CategorySettings Component Styles
 */
export const useStyles = makeStyles((theme: Theme) => ({
  categoryGroupName: {
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  categoryGroupDivider: {
    height: 1,
    backgroundColor: theme.palette.common.white,
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  row: {
    display: 'flex',
  },
}))
