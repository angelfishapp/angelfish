import type { Meta, StoryObj } from '@storybook/react'

import { Chart } from '.'

// Mock Data
import { accounts, transactions as transactionData } from '@angelfish/tests/fixtures'

/**
 * Story Metadata
 */

const meta = {
  title: 'Accounts/Chart',
  component: Chart,
  args: {
    account: accounts[123],
    transactions: transactionData,
  },
  // check this story on story book
  render: ({ ...args }) => <Chart {...args} />,
} satisfies Meta<typeof Chart>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const LineChart: Story = {
  args: {},
}
