import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { TabPanel, Tabs } from '.'

/**
 * Story Book Meta
 *
 * @type {Meta<typeof Tabs>}
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    onTabChange: (currentIndex) => action('onTabChange')(currentIndex),
    children: [],
  },
  render: (args) => (
    <Paper>
      <Tabs {...args}>
        <TabPanel index={0} label="Tab 1 Label">
          <div>Content for Tab 1</div>
        </TabPanel>
        <TabPanel index={1} label="Tab 1 Label">
          <div>Content for Tab 2</div>
        </TabPanel>
        <TabPanel index={2} label="Tab 1 Label">
          <div>Content for Tab 3</div>
        </TabPanel>
      </Tabs>
    </Paper>
  ),
} satisfies Meta<typeof Tabs>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    id: 'default-tabs',
    'aria-label': 'Default Tabs',
  },
}

export const Vertical: Story = {
  args: {
    id: 'vertical-tabs',
    'aria-label': 'Vertical Tabs',
    orientation: 'vertical',
    variant: 'scrollable',
    indicatorColor: 'secondary',
    textColor: 'secondary',
  },
}
