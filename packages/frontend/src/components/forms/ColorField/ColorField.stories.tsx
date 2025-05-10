import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { ColorField } from '.'

const meta = {
  title: 'Components/Forms/Color Field',
  component: ColorField,
  args: {
    onChange: (value) => action('onChange')(value),
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <ColorField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof ColorField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Color Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
  },
}
