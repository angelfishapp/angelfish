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
    children: (
      <Paper sx={{ width: 5000, height: 600, margin: 0 }}>
        This is the content. Reduce your viewport to see scrolling effect
      </Paper>
    ),
  },
  render: ({ children, ...args }) => <RollingContainer {...args}>{children}</RollingContainer>,
} satisfies Meta<typeof RollingContainer>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Storys
 */

export const Default: Story = {
  args: {},
}
