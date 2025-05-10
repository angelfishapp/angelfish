import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { SwitchField } from '.'

const meta = {
  title: 'Components/Forms/Switch Field',
  component: SwitchField,
  args: {
    onChange: (value) => action('onChange')(value),
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <SwitchField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof SwitchField>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Switch Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
  },
}
