import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

/**
 * AppLayout Component Styles
 */

// Container: full-screen root
export const AppLayoutContainer = styled(Box)(() => ({
  maxWidth: '100vw',
  maxHeight: '100vh',
  top: 0,
  left: 0,
}))

// Page: content area beside the sidebar
export const AppPageContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: `calc(100vw - ${theme.custom.side.width}px)`,
  height: '100vh',
  overflow: 'auto',
}))
