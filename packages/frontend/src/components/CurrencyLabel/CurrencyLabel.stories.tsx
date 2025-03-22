import { Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { CurrencyLabel } from '.'

const meta = {
  title: 'Components/CurrencyLabel',
  component: CurrencyLabel,
  args: {},
  render: ({ ...args }) => (
    <Typography>
      <CurrencyLabel {...args} />
    </Typography>
  ),
} satisfies Meta<typeof CurrencyLabel>
export default meta
type Story = StoryObj<typeof meta>

export const USD: Story = {
  args: {
    value: 3000000.5,
    currency: 'USD',
  },
}
export const GBP: Story = {
  args: {
    value: 3000000.5,
    currency: 'GBP',
  },
}
export const EUR: Story = {
  args: {
    value: 3000000.5,
    currency: 'EUR',
  },
}

export const Negative: Story = {
  args: {
    value: -3000000.5,
  },
}
