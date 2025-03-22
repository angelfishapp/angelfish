import type { Meta, StoryObj } from '@storybook/react'

import { Search } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Components/Search',
  component: Search,
  args: {},
  render: ({ ...args }) => <Search {...args} />,
} satisfies Meta<typeof Search>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {},
}
