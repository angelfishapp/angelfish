import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { AmountField } from '.'

const meta = {
  title: 'Components/Forms/Amount Field',
  component: AmountField,
  args: {
    onChange: (value) => action('onChange')(value),
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <AmountField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof AmountField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Amount',
    allowNegative: false,
    helperText: 'Enter amount',
    error: false,
    disabled: false,
    required: true,
  },
}

export const DefaultValue: Story = {
  args: {
    label: 'Amount',
    value: 1222.22,
    currency: '£',
    allowNegative: true,
  },
}
