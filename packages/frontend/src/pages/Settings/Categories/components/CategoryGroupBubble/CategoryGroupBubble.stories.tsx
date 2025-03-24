import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { ICategoryGroup } from '@angelfish/core'
import { CategoryGroupBubble } from '.'

const meta = {
  title: 'Categories/Category Group Bubble',
  component: CategoryGroupBubble,
  args: {
    onEdit: () => action('onEdit Clicked')(),
    onClick: () => action('onClick Clicked')(),
  },
  render: ({ ...args }) => <CategoryGroupBubble {...args} />,
} satisfies Meta<typeof CategoryGroupBubble>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

const categoryGroup = {
  id: 23,
  name: 'Test Group',
  type: 'Expense',
  icon: 'house',
  color: '#FF0000',
  total_categories: 5,
} as ICategoryGroup

export const Default: Story = {
  args: {
    categoryGroup,
    isSelected: false,
  },
}
