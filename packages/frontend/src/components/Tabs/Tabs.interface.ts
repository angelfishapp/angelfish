import type { TabsProps as MuiTabsProps } from '@mui/material/Tabs'
import type React from 'react'

import type { TabPanelProps } from './TabsPanel.interface'

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /**
   * ARIA label for the Tabs component.
   * This is used for accessibility purposes to describe the purpose of the Tabs.
   */
  'aria-label'?: MuiTabsProps['aria-label']
  /**
   * If true, the tabs are centered. This prop is intended for large views.
   * @default false
   */
  centered?: MuiTabsProps['centered']
  /**
   * Array of tabs to render in the Tabs component.
   * Each tab should conform to the ITab interface.
   */
  children: React.ReactElement<TabPanelProps> | React.ReactElement<TabPanelProps>[]
  /**
   * Unique identifier for the Tabs component.
   * This is used to manage the state of the component and should be unique across the application
   */
  id: string
  /**
   * The color of the indicator that shows which tab is currently active.
   * This can be one of the predefined colors in Material-UI.
   */
  indicatorColor?: MuiTabsProps['indicatorColor']
  /**
   * Callback function triggered when the active tab changes.
   * Receives the index of the newly active tab.
   */
  onTabChange?: (currentIndex: number) => void
  /**
   * The orientation of the tabs, either 'horizontal' or 'vertical'.
   * @default 'horizontal'
   */
  orientation?: MuiTabsProps['orientation']
  /**
   * Style object or function to customize the styles of the Tabs component.
   */
  sx?: MuiTabsProps['sx']
  /**
   * The text color of the tabs.
   * This can be one of the predefined colors in Material-UI.
   * @default 'primary'
   */
  textColor?: MuiTabsProps['textColor']
  /**
   * The variant of the tabs, which determines their appearance.
   * This can be 'standard', 'scrollable', or 'fullWidth'.
   * @default 'standard'
   */
  variant?: MuiTabsProps['variant']
}
