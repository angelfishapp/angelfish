/**
 * Set Global CSS Stlyes for App here
 */

import type { GlobalStylesProps } from '@mui/material/GlobalStyles'

export const AppRootStyles: GlobalStylesProps['styles'] = {
  html: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    fontFamily: "'Mukta', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI'",
  },
}
