import Box from '@mui/material/Box'
import MuiTab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'
import React from 'react'

import type { TabsProps } from './Tabs.interface'
import TabPanel from './TabsPanel'
import type { TabPanelProps } from './TabsPanel.interface'

/**
 * Tabs Component: Renders a set of tabs with a controlled state.
 */
export default function Tabs({
  'aria-label': ariaLabel,
  centered,
  children,
  id,
  index = 0,
  indicatorColor,
  orientation,
  onTabChange,
  sx,
  textColor,
  variant,
}: TabsProps) {
  // Component State
  const [openTab, setOpenTabValue] = React.useState(index)

  // Update the openTab state when the index prop changes
  React.useEffect(() => {
    setOpenTabValue(index)
  }, [index])

  // Filter out only valid TabPanel children
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabPanelProps> =>
      React.isValidElement(child) && child.type === TabPanel,
  )

  // Render
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
            .sort((a, b) => a.props.index - b.props.index)
            .map((tab, index) => (
              <MuiTab
                key={tab.props.index}
                label={tab.props.label}
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-tabpanel-${index}`}
                onClick={() => {
                  setOpenTabValue(index)
                  onTabChange?.(index)
                }}
                disableRipple={true}
              />
            ))}
        </MuiTabs>
      </Box>
      {tabs
        .sort((a, b) => a.props.index - b.props.index)
        .map((tab) => (
          <div
            key={tab.props.index}
            role="tabpanel"
            hidden={openTab !== tab.props.index}
            id={`${id}-tabpanel-${tab.props.index}`}
            aria-labelledby={`${id}-tab-${tab.props.index}`}
          >
            {openTab === tab.props.index && <Box sx={{ paddingTop: 2 }}>{tab.props.children}</Box>}
          </div>
        ))}
    </Box>
  )
}
