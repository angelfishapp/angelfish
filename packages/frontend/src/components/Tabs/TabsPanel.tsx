import type { TabPanelProps } from './TabsPanel.interface'

/**
 * TabPanel Component: Renders the content of a tab.
 * It is hidden when the tab is not active.
 *
 * Just acts as a wrapper, doesn't render panel itself
 */
const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <>{children}</>
}

export default TabPanel
