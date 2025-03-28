import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

/**
 * Drawer Component Styles
 */

export const StyledDrawer = styled(MuiDrawer)(({ anchor, theme }) => ({
  '& .MuiDrawer-paper': {
    width: anchor === 'right' ? 540 : `calc(100% - ${theme.custom.side.width}px)`,
    height: anchor === 'right' ? `calc(100vh - ${theme.spacing(2)})` : 540,
    margin: anchor === 'right' ? theme.spacing(1) : `0px 0px 0px ${theme.custom.side.width}px`,
    borderRadius: anchor === 'right' ? 20 : 0,
    overflowX: anchor === 'right' ? 'hidden' : 'auto',
    padding: 0,
    overflowY: 'auto',
  },
  '& .drawerCloseButton': {
    marginLeft: theme.spacing(1),
  },
  '& .drawerTitle': {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: 1,
    paddingLeft: theme.spacing(2),
  },
  '& .drawerContent': {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowY: 'auto',
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  '& .drawerFooter': {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}))
