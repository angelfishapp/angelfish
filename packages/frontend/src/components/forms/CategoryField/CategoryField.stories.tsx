import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import type { IAccount } from '@angelfish/core'
import { getAccountsWithRelations } from '@angelfish/tests/fixtures'

import { CategoryField } from '.'

const meta = {
  title: 'Components/Forms/Category Field',
  component: CategoryField,
  args: {
    accountsWithRelations: getAccountsWithRelations(),
    onChange: (account: any) => action('onChange')(account),
    fullWidth: true,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <CategoryField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof CategoryField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */
export const Default: Story = {
  args: {
    label: 'Category',
    onCreate: (name?) => action('onCreate')(name),
  },
}

export const WithValue: Story = {
  args: {
    label: 'Category',
    value: getAccountsWithRelations()[2],
    onCreate: (name?) => action('onCreate')(name),
  },
}

export const ShowAsTextField: Story = {
  args: {
    label: 'Category',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
  },
}

export const Filtered: Story = {
  args: {
    label: 'Bank Accounts',
    filter: (account) => account.class === 'ACCOUNT',
    disableGroupBy: true,
    disableTooltip: true,
    placeholder: 'Search Bank Accounts...',
  },
}

export const MultiSelect: Story = {
  render: ({ variant, onChange, ...args }) => {
    const RenderComponent = () => {
      const [selected, setSelected] = React.useState<IAccount[]>([])

      return (
        <Paper>
          <CategoryField
            {...args}
            value={selected}
            variant="multiselect"
            onChange={(newValue) => {
              setSelected(Array.isArray(newValue) ? newValue : [])
              onChange?.(newValue)
            }}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
  args: {
    label: 'MultiSelect',
    helperText: 'Select multiple accounts',
    disableGroupBy: false,
    disableTooltip: false,
  },
}
