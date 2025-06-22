import Box from '@mui/material/Box'
import MuiTab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'
import React from 'react'

import type { TabsProps } from './Tabs.interface'

/**
 * TabPanelProps: Defines the properties for the TabPanel component.
 */
interface TabPanelProps {
  children?: React.ReactNode
  id: string
  index: number
  value: number
}

/**
 * TabPanel Component: Renders the content of a tab.
 * It is hidden when the tab is not active.
 */
function TabPanel({ children, value, id, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

/**
 * Tabs Component: Renders a set of tabs with a controlled state.
 */
export default function Tabs({
  'aria-label': ariaLabel,
  centered,
  id,
  indicatorColor,
  orientation,
  onTabChange,
  sx,
  tabs,
  textColor,
  variant,
}: TabsProps) {
  const [openTab, setOpenTabValue] = React.useState(0)
  return (
    <Box
      sx={
        orientation === 'vertical'
          ? { flexGrow: 1, display: 'flex', width: '100%' }
          : { width: '100%' }
      }
    >
      <Box
        sx={orientation === 'vertical' ? undefined : { borderBottom: 1, borderColor: 'divider' }}
      >
        <MuiTabs
          value={openTab}
          onChange={(_, newValue) => setOpenTabValue(newValue)}
          aria-label={ariaLabel}
          centered={centered}
          id={id}
          indicatorColor={indicatorColor}
          orientation={orientation}
          sx={sx}
          textColor={textColor}
          variant={variant}
        >
          {tabs
            .sort((a, b) => a.index - b.index)
            .map((tab, index) => (
              <MuiTab
                key={tab.index}
                label={tab.label}
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-tabpanel-${index}`}
                onClick={() => {
                  setOpenTabValue(index)
                  onTabChange?.(index)
                }}
              />
            ))}
        </MuiTabs>
      </Box>
      {tabs
        .sort((a, b) => a.index - b.index)
        .map((tab, index) => (
          <TabPanel key={tab.index} id={id} value={openTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
    </Box>
  )
}
