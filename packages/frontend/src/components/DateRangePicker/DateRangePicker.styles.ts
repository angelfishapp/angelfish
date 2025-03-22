import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'

/**
 * Container Div for each Day on Calendar
 */
export const DayContainer = styled('div')(({ theme }) => ({
  width: 41,
  height: 41,
  marginBottom: 4,
  backgroundColor: 'transparent',
  '&.inHoverRange:not(.outOfMonth)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.inRange:not(.outOfMonth)': {
    backgroundColor: theme.palette.action.selected,
  },
  '&.rangeStart': {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  '&.rangeEnd': {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
}))

/**
 * Button for each Day on Calendar
 */
export const DayButton = styled(ButtonBase)(({ theme }) => ({
  width: 40,
  height: 40,
  padding: 0,
  minWidth: 'unset',
  borderRadius: '50%',
  fontSize: '0.75rem',
  backgroundColor: 'transparent',
  '&.selected': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderRadius: '50% !important',
    color: theme.palette.primary.contrastText,
  },
  '&:hover': {
    borderRadius: '50%',
    border: `1px solid ${theme.palette.action.hover}`,
    backgroundColor: theme.palette.action.hover,
  },
  '&.disabled': {
    color: theme.palette.text.disabled,
  },
  '&.outOfMonth': {
    visibility: 'hidden',
  },
  '&.today': {
    borderRadius: '50%',
    border: `1px solid ${theme.palette.common.black}`,
  },
}))

/**
 * Container Div for each Month
 */
export const MonthContainer = styled(Box)({
  width: 296,
  height: 350,
  padding: '0 8px',
  marginRight: 8,
})

/**
 * Container Div for Month Header
 */
export const MonthHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px 4px 16px',
})

/**
 * Container Div for Range Selection Menu
 */
export const RangeSelectionMenu = styled('div')(({ theme }) => ({
  flexGrow: 1,
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  width: 150,
  '& .Mui-selected': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.common.white} !important`,
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  },
}))
