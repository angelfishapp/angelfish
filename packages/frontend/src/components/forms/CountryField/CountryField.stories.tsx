import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { CountryField } from '.'

const meta = {
  title: 'Components/Forms/Country Field',
  component: CountryField,
  args: {
    onChange: (account) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <CountryField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof CountryField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Country Field',
  },
}
