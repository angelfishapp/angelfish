import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { getAccountsWithRelations } from '@angelfish/tests/fixtures'

import { MultiSelectField } from '.'

const meta = {
  title: 'Components/Forms/Multi Select Field',
  component: MultiSelectField,
  args: {
    accountsWithRelations: getAccountsWithRelations(),
    onChange: (account) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <MultiSelectField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof MultiSelectField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Category',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
    variant: 'multi-box',
  },
}
