import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { categoryGroups } from '@angelfish/tests/fixtures'
import { CategoryGroupField } from '.'

const meta = {
  title: 'Components/Forms/Category Group Field',
  component: CategoryGroupField,
  args: {
    onChange: (value, prev) => action('onChange')(value, prev),
  },
  render: ({ ...args }) => (
    <Paper>
      <CategoryGroupField {...args} />
    </Paper>
  ),
} satisfies Meta<typeof CategoryGroupField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Category Group Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
    categoryGroups,
  },
}
