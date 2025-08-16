import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { AppRoutes } from '../../Routes'
import { PrimaryMenu } from '../PrimaryMenu'
import type { AppLayoutProps } from './AppLayout.interface'
import { AppLayoutContainer, AppPageContainer } from './AppLayout.styles'
import theme from '@/app/theme'
import { useI18n } from '@/utils/i18n/I18nProvider'

/**
 * Main layout for the app
 */
export default React.forwardRef(function AppLayout(
  { authenticatedUser, onLogout }: AppLayoutProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { localeData } = useI18n()

  // Render
  return (
    <AppLayoutContainer>
      <PrimaryMenu authenticatedUser={authenticatedUser} onLogout={onLogout} />
      <AppPageContainer
        display="flex"
        flexGrow={1}
        flexDirection="column"
        ref={ref}
        id="app-viewport"
        sx={localeData.direction === 'ltr' ? { ml: `${theme.custom.side.width}px` } : { mr: `${theme.custom.side.width}px` }}
      >
        <Routes>
          {/* Need to slice (copy) then reverse as / path should be last or switching doesn't work */}
          {AppRoutes.slice()
            .reverse()
            .map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
      </AppPageContainer>
    </AppLayoutContainer>
  )
})
