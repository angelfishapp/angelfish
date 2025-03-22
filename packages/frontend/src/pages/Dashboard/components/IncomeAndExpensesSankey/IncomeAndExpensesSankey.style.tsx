import { styled } from '@mui/material/styles'
import type { TooltipProps } from '@mui/material/Tooltip'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

/**
 * Custom Tooltip for sankey Income Expense Chart
 */
export const IncomeAndExpensesSankeyTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.palette.primary.main,
    transformOrigin: 'bottom left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transform: 'translate(37%, -50%) rotate(-45deg) scale(1) !important',
    '&:before': { display: 'none' },
  },
}))
