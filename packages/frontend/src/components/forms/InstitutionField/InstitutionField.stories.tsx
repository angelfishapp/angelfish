import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { institutions as INSTITUTIONS } from '@angelfish/tests/fixtures'
import { InstitutionField } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Forms/Institution Field',
  component: InstitutionField,
  args: {
    institutions: INSTITUTIONS,
    onChange: (institution) => action('onChange')(institution),
    fullWidth: true,
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentValue, setCurrentValue] = React.useState(value ?? null)

      return (
        <Paper>
          <InstitutionField
            onChange={(institution) => {
              onChange?.(institution)
              setCurrentValue(institution)
            }}
            value={currentValue ?? undefined}
            {...args}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof InstitutionField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const EmptyValue: Story = {
  args: {
    label: 'Institution Field',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Institution Field',
    value: INSTITUTIONS[1],
  },
}
