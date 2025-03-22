import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * CategoriesTable Component Styles
 */

export const useTableStyles = makeStyles((theme: Theme) => ({
  headCell: {
    fontSize: '0.8rem',
    border: 'none',
    padding: theme.spacing(0.25),
  },
  labelTableHead: {
    textTransform: 'capitalize',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  tableContainer: {
    padding: theme.spacing(1),
    width: '98%',
  },
  table: {
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
    },
  },
  cell: {
    fontSize: '0.8rem',
    border: 'none',
    padding: theme.spacing(0.25),
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 75ms ease',
  },
  categoryDataGrid: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 30,
  },
  categoryDataGridPointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '1rem solid transparent',
    borderRight: '1rem solid transparent',
    borderBottom: '1rem solid white',
    top: 0,
    transform: 'translate(-50%,-100%)',
  },
  categoryTableSlider: {
    height: 0,
    maxHeight: 0,
    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 0.15)',
    overflow: 'hidden',
  },
  categoryTableSliderActive: {
    height: 'auto',
    maxHeight: 'none !important',
  },
}))
