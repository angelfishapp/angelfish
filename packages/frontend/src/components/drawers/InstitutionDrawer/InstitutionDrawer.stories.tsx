import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { institutions, searchInstitutions } from '@angelfish/tests/fixtures'

import { InstitutionDrawer } from '.'

/**
 * Story Template
 */

const meta = {
  title: 'Components/Drawers/Institution',
  component: InstitutionDrawer,
  args: {
    onClose: () => action('onClose')(),
    onSave: (institution) => action('onSave')(institution),
    onRemove: (id) => action('onRemove')(id),
    onSearch: searchInstitutions,
  },
  render: ({ ...args }) => <InstitutionDrawer {...args} />,
} satisfies Meta<typeof InstitutionDrawer>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const UpdateInstitution: Story = {
  args: {
    open: true,
    initialValue: institutions[0],
  },
}

export const AddNewInstitution: Story = {
  args: {
    open: true,
  },
}
