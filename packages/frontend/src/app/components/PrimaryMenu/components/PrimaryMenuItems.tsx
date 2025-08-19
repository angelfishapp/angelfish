import { Tab, Tabs } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ListedAppRoutes } from '@/app/Routes'
import { useI18n } from '@/utils/i18n/I18nProvider'
/**
 * Main Component - Shows Primary Menu Items in Primary Menu on left hand side of app
 */

export default function PrimaryMenuItems() {
  const { localeData: t } = useI18n()
  const currentPage = useLocation().pathname
  const [currentTab, setCurrentTab] = React.useState<string>(currentPage)

  useEffect(() => {
    /* Sync the tab to the current route. */
    setCurrentTab(currentPage)
  }, [currentPage])

  /**
   * Handle Changing the Tab
   */
  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setCurrentTab(newValue)
  }

  /* Check if router group contains the current location. */
  const hasTab = Boolean(ListedAppRoutes.filter(({ path }) => currentPage === path).length)

  return (
    <Tabs
      orientation="vertical"
      // Hide the active location if handled in another component.
      // Prevents errors associated with required Tabs value value.
      value={hasTab && currentTab}
      onChange={handleChange}
      sx={{
        width: '100%',
        '& .MuiTabs-indicator': {
          left: 0,
          right: 'auto',
          backgroundColor: 'common.white',
          width: 4,
        },
      }}
    >
      {ListedAppRoutes.map(({ label, Icon, path }) => (
        <Tab
          label={t.routes[label as keyof typeof t.routes]}
          icon={<Icon />}
          key={label}
          value={path}
          component={Link}
          to={path}
          sx={{
            color: 'common.white',
            fontSize: '14px',
            width: 'auto',
            textTransform: 'capitalize',
            marginTop: 0.25,
            marginBottom: 0.25,
            '&.Mui-selected': {
              color: 'common.white',
            },
          }}
        />
      ))}
    </Tabs>
  )
}
