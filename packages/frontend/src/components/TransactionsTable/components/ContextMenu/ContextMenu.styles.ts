import { styled } from '@mui/material/styles'

import { ContextMenu } from '@/components/ContextMenu'

/**
 * Transactions Table ContextMenu Component Styles
 */

export const StyledContextMenu = styled(ContextMenu)(({ theme }) => ({
  '& .menuItemRemove': {
    color: theme.palette.error.main,
  },
  '& .menuSummary': {
    color: theme.palette.grey[600],
    cursor: 'default',
    userSelect: 'text',
  },
  '& .categoriesSubMenu': {
    minWidth: 350,
    paddingTop: 10,
    paddingBottom: 10,
    width: 350,
    '& .search-categories': {
      backgroundColor: `${theme.palette.common.white} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.common.white} !important`,
      },
    },
  },
  '& .tagsSubMenu': {
    minWidth: 300,
    width: 300,
    '& .tags': {
      backgroundColor: `${theme.palette.common.white} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.common.white} !important`,
      },
    },
  },
}))
