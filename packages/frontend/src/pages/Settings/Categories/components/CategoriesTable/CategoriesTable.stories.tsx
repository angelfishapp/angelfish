import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { IAccount } from '@angelfish/core'
import { accounts } from '@angelfish/tests/fixtures'
import { CategoriesTable } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Categories/Categories Table',
  component: CategoriesTable,
  args: {
    onSelect: (category: IAccount) => action('onSelect Clicked')(category),
    pointerPosition: 40,
  },
  render: ({ ...args }) => <CategoriesTable {...args} />,
} satisfies Meta<typeof CategoriesTable>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const FilteredToHomeGroup: Story = {
  args: {
    categories: accounts.filter((account) => {
      return account.cat_group_id == 2
    }),
  },
}

export const NoCategories: Story = {
  args: {
    categories: [],
  },
}

export const AllCategories: Story = {
  args: {
    categories: accounts.filter((account) => {
      return account.class == 'CATEGORY'
    }),
  },
}
