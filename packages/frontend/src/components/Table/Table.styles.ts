import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { styled } from '@mui/styles'

/**
 * Table Component Styles
 */
export const StyledTable = styled(MuiTable)(({ theme }) => ({
  // Ensure column sizes are respected
  tableLayout: 'fixed',
  // Primary Table Styles
  '&.Table-variant-primary .MuiTableRow-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '& .sortable': {
      textTransform: 'capitalize',
      color: `${theme.palette.common.white} !important`,
      '& svg': {
        fill: `${theme.palette.common.white} !important`,
      },
    },
    '& .resizer': {
      backgroundColor: theme.palette.common.white,
    },
  },
  // Need to add back Sticky Header Styles at thead level
  // as MUI does it at th level which affects resizing bars
  '&.MuiTable-stickyHeader thead': {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    '&::after': {
      position: 'absolute',
      display: 'inline-block',
      content: '""',
      boxShadow: '0 6px 12px 0 #757575',
      height: '100%',
      pointerEvents: 'none',
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  // Table Headers for resizing
  '& th': {
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    border: 'none',
    '& .resizer': {
      position: 'absolute',
      right: 0,
      top: 3,
      bottom: 0,
      width: 3,
      height: '85%',
      background: theme.palette.common.black,
      cursor: 'col-resize',
      userSelect: 'none',
      touchAction: 'none',
      opacity: 0.4,
      borderRadius: '99rem',
      transition: 'opacity .2s ease-in-out',
      '&:hover': {
        opacity: 1,
      },
      '&.isResizing': {
        opacity: 1,
      },
    },
  },
  // Add zebra striping to table cells (td), subRows will inherit from parent
  '& tbody': {
    '& td': {
      backgroundColor: theme.palette.common.white,
    },
    '&.striped td': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  // Make sure padding rows are always white while scrolling
  '& .paddingRow': {
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  // No Data Row Style
  '& td.nodata': {
    textAlign: 'center',
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  // Table Footer Styles
  '& .MuiTableFooter-root': {
    '& td': {
      fontSize: '1rem',
      whiteSpace: 'nowrap',
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.common.black,
      fontWeight: 700,
    },
  },
}))

/**
 * Table Row Component Styles
 */
export const StyledTableBody = styled(TableBody)(({ onClick }) => ({
  cursor: onClick ? 'pointer' : undefined,
  userSelect: onClick ? 'none' : undefined,
}))
