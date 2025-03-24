import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { CategoryGroupType, ICategoryGroup } from '@angelfish/core'
import { CategoryGroupDrawer } from '.'

const categoryGroup = {
  name: 'Test Category Group',
  description: 'A test category group description',
  icon: 'house',
  type: 'Expense' as CategoryGroupType,
} as ICategoryGroup
const meta = {
  title: 'Components/Drawers/Category Group',
  component: CategoryGroupDrawer,
  args: {
    onSave: (categoryGroup) => action('onSave')(categoryGroup),
    onDelete: (categoryGroup) => action('onDelete')(categoryGroup),
    onClose: () => action('onClose')(),
  },
  render: ({ ...args }) => <CategoryGroupDrawer {...args} />,
} satisfies Meta<typeof CategoryGroupDrawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const UpdateCategoryGroup: Story = {
  args: {
    categoryGroup,
    open: true,
  },
}

export const AddNewCategoryGroup: Story = {
  args: {
    open: true,
  },
}
