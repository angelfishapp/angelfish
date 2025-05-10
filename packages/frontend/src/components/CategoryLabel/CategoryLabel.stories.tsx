import type { Meta, StoryObj } from '@storybook/react'

import { CategoryLabel } from '.'

// Mock Data
import { accounts as ACCOUNTS } from '@angelfish/tests/fixtures'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Category Label',
  component: CategoryLabel,
  args: {},
  render: ({ ...args }) => <CategoryLabel {...args} />,
} satisfies Meta<typeof CategoryLabel>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Category: Story = {
  args: {
    account: ACCOUNTS[42],
  },
}
export const Transfer: Story = {
  args: {
    account: ACCOUNTS[125],
  },
}
export const Unclassified: Story = {
  args: {},
}
