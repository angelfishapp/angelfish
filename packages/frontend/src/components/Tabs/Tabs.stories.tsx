import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { Tabs } from '.'

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
  },
  render: (args) => (
    <Paper>
      <Tabs {...args} />
    </Paper>
  ),
} satisfies Meta<typeof Tabs>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Storys
 */

const tabs = [
  {
    index: 0,
    label: 'Tab 1 Label',
    content: <div>Content for Tab 1</div>,
  },
  {
    index: 1,
    label: 'Tab 2 Label',
    content: <div>Content for Tab 2</div>,
  },
  {
    index: 2,
    label: 'Tab 3 Label',
    content: <div>Content for Tab 3</div>,
  },
]

export const Default: Story = {
  args: {
    id: 'default-tabs',
    'aria-label': 'Default Tabs',
    tabs,
  },
}

export const Vertical: Story = {
  args: {
    id: 'vertical-tabs',
    'aria-label': 'Vertical Tabs',
    tabs,
    orientation: 'vertical',
    variant: 'scrollable',
    indicatorColor: 'secondary',
    textColor: 'secondary',
  },
}
