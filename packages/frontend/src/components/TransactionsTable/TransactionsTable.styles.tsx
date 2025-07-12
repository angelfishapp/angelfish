import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { forwardRef } from 'react'

import { Table } from '@/components/Table'
import type { FilterBarWrapperProps, TransactionsTableProps } from './TransactionsTable.interface'
import type { TransactionRow } from './data'

const UnstyledTable = Table<TransactionRow>

/**
 * TransactionsTable Component Styles
 */

type StyleProps = {
  tableVarient?: TransactionsTableProps['variant']
}

export const StyledTransactionTable = styled(UnstyledTable, {
  shouldForwardProp: (prop) => prop !== 'tableVarient',
})<StyleProps>(({ theme, tableVarient }) => ({
  // Reset table zIndex
  zIndex: 0,
  // Make table corners rounded and add shadow if variant is raised
  borderRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  boxShadow: tableVarient === 'raised' ? theme.shadows[8] : undefined,
  '& thead:first-of-type th:first-of-type': {
    borderTopLeftRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  },
  '& thead:first-of-type th:last-of-type': {
    borderTopRightRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
  },
  '& tfoot tr:last-of-type, table:not(:has(tfoot)) tbody:last-of-type tr:last-of-type': {
    '& td:first-of-type': {
      borderBottomLeftRadius: tableVarient === 'raised' ? theme.spacing(1) : undefined,
    },
    '& td:last-of-type': {
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
  '& table.subTable tbody:last-of-type tr:last-of-type': {
    '& td:first-of-type': {
      borderBottomLeftRadius: '0px !important',
    },
    '& td:last-of-type': {
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
    '& td:first-of-type': {
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

export const FilterBarWrapper = forwardRef<HTMLDivElement, FilterBarWrapperProps>(
  ({ children, isSticky }, ref) => (
    <Box
      ref={ref}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 102,
        backgroundColor: isSticky ? 'primary.main' : 'transparent',
        height: isSticky ? 90 : 50,
        padding: '20px',
        width: '100%',
      }}
    >
      {children}
    </Box>
  ),
)
FilterBarWrapper.displayName = 'FilterBarWrapper'

export const PositionedContainer = styled('div')({
  position: 'relative',
  padding: 0,
})
export const StickyTableContainer = styled('div')({
  position: 'relative',
})

export const StickySentinel = styled('div')({
  position: 'absolute',
  top: 0,
  height: '1px',
  width: '100%',
  pointerEvents: 'none',
})
