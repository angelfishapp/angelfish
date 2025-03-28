import { styled } from '@mui/material/styles'

/**
 * CategorySettings Component Styles
 */

export const StyledCategoryGroupName = styled('div')(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: 18,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}))

export const StyledCategoryGroupDivider = styled('div')(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.common.white,
  flexGrow: 1,
  marginLeft: theme.spacing(2),
}))
