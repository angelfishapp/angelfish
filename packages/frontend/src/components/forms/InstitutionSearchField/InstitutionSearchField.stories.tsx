import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { searchInstitutions } from '@angelfish/tests/fixtures'
import { InstitutionSearchField } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Forms/Institution Search Field',
  component: InstitutionSearchField,
  args: {
    onChange: (name, institution) => action('onChange')(name, institution),
    onSearch: searchInstitutions,
    fullWidth: true,
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentValue, setCurrentValue] = React.useState(value ?? '')

      return (
        <Paper>
          <InstitutionSearchField
            onChange={(name, institution) => {
              onChange?.(name, institution)
              setCurrentValue(name)
            }}
            value={currentValue}
            {...args}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof InstitutionSearchField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const EmptyValue: Story = {
  args: {
    label: 'Institution Search Field',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Institution Search Field',
    value: 'HSBC Bank',
  },
}
