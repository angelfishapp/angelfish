import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { IAccount } from '@angelfish/core'
import { accounts, categoryGroups as categoryGroupsData } from '@angelfish/tests/fixtures'
import { CategoryDrawer } from '.'

const meta = {
  title: 'Components/Drawers/Category',
  component: CategoryDrawer,
  args: {
    onSave: (account) => action('onSave')(account),
    onDelete: (account) => action('onDelete')(account),
    onClose: () => action('onClose')(),
    categoryGroups: categoryGroupsData,
  },
  render: ({ ...args }) => {
    return <CategoryDrawer {...args} />
  },
} satisfies Meta<typeof CategoryDrawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const UpdateCategoryGroup: Story = {
  args: {
    open: true,
    initialValue: accounts[0],
    categoryGroups: categoryGroupsData,
  },
}

export const AddNewCategoryGroup: Story = {
  args: {
    open: true,
    initialGroupType: 'Income',
    initialValue: {
      name: 'Test Name',
    } as IAccount,
    categoryGroups: categoryGroupsData,
  },
}
