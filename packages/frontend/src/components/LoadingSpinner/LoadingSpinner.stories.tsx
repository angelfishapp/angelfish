import type { Meta, StoryObj } from '@storybook/react'

import { LoadingSpinner } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  args: {},
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit'],
      control: {
        type: 'select',
      },
    },
  },
  render: (args) => <LoadingSpinner {...args} />,
} satisfies Meta<typeof LoadingSpinner>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    color: 'primary',
    size: 100,
  },
}
