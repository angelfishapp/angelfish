import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * ReportsTable Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  table: {
    '& table': {
      // Make sure name cell right border doesn't scroll with sticky column
      borderCollapse: 'separate',
    },
    '& .MuiTableRow-root .MuiTableCell-root:first-of-type': {
      // Add right border to name cell
      borderRight: `1px solid ${theme.palette.grey[400]}`,
    },
    '& .MuiTableCell-root.isPinned': {
      // Make name cell width 300px
      width: 300,
      // Make sure ::after shadow isn't hidden
      overflow: 'visible',
    },
    '& .MuiTableCell-root.isPinned.left': {
      textAlign: 'left',
    },
    '& .MuiTableCell-root': {
      width: 145,
      textAlign: 'right',
      borderBottom: 'none',
      cursor: 'default',
    },
    '& .expanded > td': {
      fontWeight: 'bold',
    },
    '& .currency': {
      cursor: 'pointer',
      fontSize: 18,
    },
    '& .total-currency': {
      fontSize: 18,
    },
    '& .expand-arrow': {
      cursor: 'pointer',
    },
    '& .col-id-total': {
      borderLeft: `1px solid ${theme.palette.grey[400]}`,
    },
    '& .name': {
      fontSize: 18,
      height: 24,
      marginLeft: 8,
      width: 225,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  netSummary: {
    cursor: 'default',
    '& .MuiTableCell-root.isPinned': {
      // Make name cell width 300px
      width: 300,
      // Make sure ::after shadow isn't hidden
      overflow: 'visible',
    },
    '& td': {
      fontWeight: 600,
      fontSize: 18,
      textAlign: 'right',
      color: theme.palette.common.white,
      backgroundColor: `${theme.palette.primary.dark} !important`,
      cursor: 'default',
    },
    '& .col-id-total': {
      borderLeft: `1px solid ${theme.palette.grey[400]}`,
    },
  },
}))
