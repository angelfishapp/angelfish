import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { OOBField } from '.'

const meta = {
  title: 'Components/Forms/OOB Field',
  component: OOBField,
  args: {},
  render: ({ onSubmit, ...args }) => {
    const RenderComponent = () => {
      const [helperText, setHelperText] = React.useState<string>(
        'Enter or paste the verification code',
      )

      const handleSubmit = async (verificationCode: string) => {
        action('onSubmit')(verificationCode)
        setHelperText('Verifying...')
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setHelperText('Enter or paste the verification code')
      }

      return (
        <Paper>
          <OOBField {...args} onSubmit={handleSubmit} helperText={helperText} />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof OOBField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    digitCount: 6,
  },
}
