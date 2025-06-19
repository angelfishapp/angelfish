import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CategoryLabel } from '@/components/CategoryLabel'
import type { IAccount, ITag } from '@angelfish/core'
import { getAccountsWithRelations, tags as tagsData } from '@angelfish/tests/fixtures'

import { MultiSelectField } from '.'

const meta = {
  title: 'Components/Forms/Multi Select Field',
  component: MultiSelectField,
  args: {
    fullWidth: true,
    value: [],
    onChange: (event, value, reason, details) => action('onChange')(event, value, reason, details),
  },
  render: ({ onChange, ...args }) => {
    const RenderComponent = () => {
      const [selected, setSelected] = React.useState<unknown[]>([])

      return (
        <Paper>
          <MultiSelectField
            {...args}
            value={selected}
            onChange={(event, val, reason, details) => {
              setSelected(Array.isArray(val) ? val : [])
              onChange?.(event, val, reason, details)
            }}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof MultiSelectField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Categories: Story = {
  args: {
    // Need to sort categories by group name to avoid duplicate group names
    options: getAccountsWithRelations().sort((a, b) => {
      const aGroup = a.class == 'CATEGORY' ? (a.categoryGroup?.name ?? '') : 'ZZZZ'
      const bGroup = b.class == 'CATEGORY' ? (b.categoryGroup?.name ?? '') : 'ZZZZ'
      return aGroup.localeCompare(bGroup)
    }) as IAccount[],
    label: 'Categories',
    placeholder: 'Search Categories...',
    groupBy: (option) => {
      const account = option as IAccount
      if (account.class == 'CATEGORY') {
        if (account.id != 0) {
          return account.categoryGroup?.name ?? ''
        }
        return ''
      }
      return 'Account Transfer'
    },
    getOptionKey: (option) => {
      const account = option as IAccount
      return account.id
    },
    getOptionLabel: (option) => {
      const account = option as IAccount
      if (account.class === 'CATEGORY') {
        return `${account.name} (${account.categoryGroup?.name})`
      }
      return `${account.name} (${account.institution?.name})`
    },
    filterOptions: (options, { inputValue }) => {
      if (inputValue.trim() === '') {
        return options
      }

      // Filter options based on input value
      const searchOptions: Record<string, string> = {}
      for (const account of options as IAccount[]) {
        if (account.class == 'CATEGORY') {
          searchOptions[account.id] =
            `${account.name} ${account.categoryGroup?.name}  ${account.cat_description}`.toLowerCase()
        } else {
          searchOptions[account.id] = `${account.name} ${account.institution?.name}`.toLowerCase()
        }
      }
      return (options as IAccount[]).filter((account) => {
        return searchOptions[account.id].indexOf(inputValue.toLowerCase()) > -1
      })
    },
    renderOption: (option) => {
      const account = option as IAccount
      return <CategoryLabel account={account} displayGroup={false} />
    },
  },
}

export const Tags: Story = {
  args: {
    options: tagsData,
    placeholder: 'Search Tags...',
    label: 'Tags',
    getOptionKey: (option) => {
      const tag = option as ITag
      return tag.id
    },
    getOptionLabel: (option) => {
      const tag = option as ITag
      return tag.name
    },
  },
}
