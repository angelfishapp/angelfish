import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { EmojiField } from '.'

const meta = {
  title: 'Components/Forms/Emoji Field',
  component: EmojiField,
  args: {
    onChange: (value) => action('onChange')(value),
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <EmojiField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof EmojiField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Emoji Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
  },
}
