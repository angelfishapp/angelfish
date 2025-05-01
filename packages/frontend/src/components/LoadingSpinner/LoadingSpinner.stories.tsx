import type { Meta, StoryObj } from '@storybook/react'
import LoadingSpinner from './LoadingSpinner'

/**
 * Story Metadata
 */

const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  args: {},
  render: () => <LoadingSpinner />,
} satisfies Meta<typeof LoadingSpinner>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {},
}
