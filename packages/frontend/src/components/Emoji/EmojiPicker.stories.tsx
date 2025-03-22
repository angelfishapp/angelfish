import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { EmojiPicker } from '.'

const meta = {
  title: 'Components/EmojiPicker',
  component: EmojiPicker,
  args: {
    onSelect: (emoji) => action('onSelect')(emoji),
  },
  render: ({ ...args }) => <EmojiPicker {...args} />,
} satisfies Meta<typeof EmojiPicker>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
