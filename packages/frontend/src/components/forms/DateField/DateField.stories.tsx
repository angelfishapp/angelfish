import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { DateField } from '.'

const meta = {
  title: 'Components/Forms/Date Field',
  component: DateField,
  args: {
    onChange: (date) => action('onChange')(date),
    fullWidth: false,
  },
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const { onChange, value, ...props } = args

      const [currentValue, setCurrentValue] = React.useState<Date>(value ?? new Date())
      const handleChange = (date: Date, value?: string) => {
        setCurrentValue(date)
        onChange?.(date)
      }

      return (
        <Paper>
          <DateField onChange={handleChange} value={currentValue} {...props} />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof DateField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Date Field',
    helperText: '',
    error: false,
    disabled: false,
    fullWidth: false,
    required: false,
  },
}
