import { styled } from '@mui/material/styles'

import { Table } from '@/components/Table'
import type { TransactionsTableProps } from './TransactionsTable.interface'
import type { TransactionRow } from './data'

const UnstyledTable = Table<TransactionRow>

/**
 * TransactionsTable Component Styles
 */

type StyleProps = {
  tableVarient?: TransactionsTableProps['variant']
}

export const StyledTransactionTable = styled(UnstyledTable, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyleProps>(({ theme, tableVarient }) => ({
  // Reset table zIndex
  zIndex: 0,
  // Make table corners rounded and add shadow if variant is raised
  borderRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  boxShadow: tableVarient === 'raised' ? theme.shadows[8] : undefined,
  '& thead:first-child th:first-child': {
    borderTopLeftRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  },
  '& thead:first-child th:last-child': {
    borderTopRightRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  },
  '& tfoot tr:last-child, table:not(:has(tfoot)) tbody:last-of-type tr:last-child': {
    '& td:first-child': {
      borderBottomLeftRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
    },
    '& td:last-child': {
      borderBottomRightRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
    },
  },

  // Add zebra striping to table rows. Subrows will inherit from parent row
  '& tbody': {
    '& tr': {
      backgroundColor: theme.palette.common.white,
    },
    '& tr.subRow:last-of-type td': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
  },

  '& tbody:nth-of-type(even)': {
    '& tr': {
      backgroundColor: theme.palette.grey[100],
    },
    '& tr.subRow:last-of-type td': {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
  },

  // Increase padding for empty table view
  '& td.nodata': {
    padding: 20,
  },

  // Expanded rows
  '& .expanded > td': {
    borderBottom: 'none',
  },

  // Sub-table for expanded rows styles
  // Remove rounded boarders
  '& table.subTable tbody:last-of-type tr:last-child': {
    '& td:first-child': {
      borderBottomLeftRadius: '0px !important',
    },
    '& td:last-child': {
      borderBottomRightRadius: '0px !important',
    },
  },

  // Subrows
  '& .subRow > td': {
    borderBottom: 'none',
  },

  // Editable Rows
  '& .isEditing': {
    backgroundColor: `${theme.palette.grey[400]} !important`,
    '& > td': {
      height: 60,
      borderBottom: 'none',
      verticalAlign: 'top',
      padding: '5px 3px 0px',
    },
    '& td:first-child': {
      borderLeft: `5px solid ${theme.palette.primary.main}`,
    },
    '&:hover': {
      backgroundColor: `${theme.palette.grey[400]} !important`,
    },
    // Amount left text
    '& .amountLeft': {
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.palette.success.main,
      '&.notZero': {
        color: theme.palette.error.main,
      },
    },
  },
  '& tr.noHoverEffect:not(.Mui-selected):hover': {
    backgroundColor: 'inherit',
  },

  // Column Styles

  '& .expand-arrow': {
    verticalAlign: 'middle',
  },

  '& .category': {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
    lineHeight: theme.typography.body2.lineHeight,
  },

  '& .currency': {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },

  '& .amount-credit': {
    color: theme.palette.secondary.dark,
  },

  '& .balance-negative': {
    color: theme.palette.error.main,
  },

  '& .is_reviewed': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
