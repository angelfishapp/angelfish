import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import type { SelectChangeEvent } from '@mui/material/Select'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React, { type ReactNode } from 'react'

import { SelectField } from '.'
const meta = {
  title: 'Components/Forms/Select Field',
  component: SelectField,
  args: {
    onChange: (event, child) => action('onChange')(event, child),
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentValue, setCurrentValue] = React.useState(value ? value : '')
      const handleChange = (event: SelectChangeEvent<unknown>, child?: ReactNode) => {
        setCurrentValue(event.target.value as number)
        onChange?.(event, child)
      }

      return (
        <Paper>
          <SelectField onChange={handleChange} value={currentValue} {...args}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <ListSubheader>Category 1</ListSubheader>
            <MenuItem value={1}>Option 1</MenuItem>
            <MenuItem value={2}>Option 2</MenuItem>
            <ListSubheader>Category 2</ListSubheader>
            <MenuItem value={3}>Option 3</MenuItem>
            <MenuItem value={4}>Option 4</MenuItem>
          </SelectField>
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof SelectField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Select Field',
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
  },
}
