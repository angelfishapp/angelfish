import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { PhoneField } from '.'

/**
 * Story Metadata
 */

const meta = {
  title: 'Components/Forms/Phone Field',
  component: PhoneField,
  args: {
    onChange: (phone, isValid) => action('onChange')(phone, isValid),
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentValue, setCurrentValue] = React.useState<string>(value as string)
      const handleChange = (phone: string, isValid: boolean) => {
        setCurrentValue(phone)
        onChange?.(phone, isValid)
      }

      return (
        <Paper>
          <PhoneField onChange={handleChange} value={currentValue} {...args} />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof PhoneField>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Phone Field',
    helperText: '',
    error: false,
    disabled: false,
    fullWidth: false,
    required: false,
  },
}
