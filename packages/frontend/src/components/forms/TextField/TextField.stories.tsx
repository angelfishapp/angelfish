import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { TextField } from '.'

const meta = {
  title: 'Components/Forms/Text Field',
  component: TextField,
  args: {
    onChange: (event) => action('onChange')(event.target.value),
  },
  render: ({ ...args }) => (
    <Paper>
      <TextField {...args} />
    </Paper>
  ),
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const SingleLineText: Story = {
  args: {
    label: 'Single Line Textfield',
    required: true,
    error: false,
    fullWidth: false,
    placeholder: 'Placeholder text...',
    helperText: 'Here is some helper text',
    disabled: false,
    type: 'text',
  },
}

export const WithAdornments: Story = {
  args: {
    label: 'Adornment Textfield',
    required: true,
    error: false,
    fullWidth: false,
    helperText: 'Here is some helper text',
    disabled: false,
    slotProps: {
      input: {
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
      },
    },
  },
}

export const MultiLineText: Story = {
  args: {
    label: 'Multi Line Textfield',
    required: true,
    multiline: true,
    rows: 3,
    maxRows: 5,
    fullWidth: false,
    error: false,
    placeholder: 'Placeholder text...',
    helperText: 'Here is some helper text',
    disabled: false,
  },
}
