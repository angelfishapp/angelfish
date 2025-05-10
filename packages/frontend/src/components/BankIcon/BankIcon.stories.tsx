import Paper from '@mui/material/Paper'
import type { Meta, StoryObj } from '@storybook/react'

import { institutions } from '@angelfish/tests/fixtures'
import { BankIcon } from '.'

const meta = {
  title: 'Components/BankIcon',
  component: BankIcon,
  args: {},
  render: ({ ...args }) => (
    <Paper>
      <BankIcon {...args} />
    </Paper>
  ),
} satisfies Meta<typeof BankIcon>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Chase: Story = {
  args: {
    logo: institutions[0].logo,
  },
}
export const WellsFargo: Story = {
  args: {
    logo: institutions[1].logo,
  },
}
export const HSBC: Story = {
  args: {
    logo: institutions[2].logo,
  },
}
export const Error: Story = {
  args: {
    logo: institutions[2].logo,
    error: 'There was an error connecting to your account',
  },
}
export const NoLogo: Story = {}
