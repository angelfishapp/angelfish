import Paper from '@mui/material/Paper'
import type { Meta, StoryObj } from '@storybook/react'

import { RollingContainer } from '.'

/**
 * Story Book Meta
 *
 * @type {Meta<typeof RollingContainer>}
 */
const meta = {
  title: 'Components/Rolling Container',
  component: RollingContainer,
  args: {
    children: (createScrollBar) => {
      // Create multiple scroll bar components
      const ScrollBar = createScrollBar('ScrollBar')
      const ExtraScrollBar = createScrollBar('charts')


      return (
        <Paper sx={{ width: 5000, height: 600, margin: 0 }}>
          This is the content. Reduce your viewport to see scrolling effect
          <ScrollBar />
          This is the content. Reduce your viewport to see scrolling effect
          <ExtraScrollBar />
        </Paper>
      )
    },
  },
  render: ({ children, ...args }) => <RollingContainer {...args}>{children}</RollingContainer>,
} satisfies Meta<typeof RollingContainer>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {
    showSyncScrollbar: true,
    syncScrollbarPosition: 'external',
  },
}
