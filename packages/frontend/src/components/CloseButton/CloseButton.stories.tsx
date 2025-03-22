import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { CloseButton } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/CloseButton',
  component: CloseButton,
  args: {
    onClick: () => action('onClick Pressed')(),
  },
  render: ({ onClick, ...args }) => <CloseButton onClick={action('onClick Pressed')} {...args} />,
} satisfies Meta<typeof CloseButton>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {},
}
export const Small: Story = {
  args: {
    small: true,
  },
}
