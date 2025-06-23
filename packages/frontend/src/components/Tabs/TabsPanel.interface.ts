/**
 * TabPanelProps: Defines the properties for the TabPanel component.
 */
export interface TabPanelProps {
  /**
   * The content to be displayed within the tab panel.
   */
  children?: React.ReactNode
  /**
   * The unique index of the tab panel. Should start from 0 and
   * be unique across all tab panels.
   */
  index: number
  /**
   * The label to display for the tab panel.
   */
  label: string
}
