import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { CurrencyField } from '.'

const meta = {
  title: 'Components/Forms/Currency Field',
  component: CurrencyField,
  args: {
    onChange: (account) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <CurrencyField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof CurrencyField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Currency Field',
  },
}
