import type { Meta, StoryObj } from '@storybook/react'

import { Emoji } from '.'

const meta = {
  title: 'Components/Emoji',
  component: Emoji,
  args: {},
  render: ({ ...args }) => <Emoji {...args} />,
} satisfies Meta<typeof Emoji>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 64,
    emoji: 'house',
  },
}

export const InvalidEmoji: Story = {
  args: {
    size: 64,
    emoji: 'ssdsdsd',
  },
}
