import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import {
  getAccountsWithRelations,
  institutions as INSTITUTIONS,
  tags as tagsData,
} from '@angelfish/tests/fixtures'

import type { IAccount, IInstitution, ITag } from '@angelfish/core'
import { useState } from 'react'
import { MultiSelectField } from '.'

const meta = {
  title: 'Components/Forms/Multi Select Field',
  component: MultiSelectField,
  args: {
    fullWidth: true,
    renderAsValue: false,
    value: [],
    onChange: action('onChange'),
  },
  render: ({ ...args }) => {
    function RenderComponent<T extends IAccount | IInstitution | ITag>() {
      const [selected, setSelected] = useState<T[]>([])

      return (
        <Paper>
          <MultiSelectField
            {...args}
            value={selected}
            onChange={(value) => {
              if (Array.isArray(value)) {
                setSelected(value as T[])
              } else if (value && typeof value === 'object') {
                setSelected([value as T])
              } else {
                setSelected([])
              }
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

export const Default: Story = {
  args: {
    data: getAccountsWithRelations(),
    label: 'Categories',
    placeholder: 'Search Categories...',
    onCreate: (name: string) => action('onCreate')(name),
  },
}
export const Institutions: Story = {
  args: {
    data: INSTITUTIONS,
    placeholder: 'Search Institutions...',
    label: 'Institutions',
    onCreate: (name: string) => action('onCreate')(name),
  },
}
export const Tags: Story = {
  args: {
    data: tagsData,
    placeholder: 'Search Tags...',
    label: 'Tags',
    onCreate: (name: string) => action('onCreate')(name),
  },
}
// there is an error with Currencies ID it take code as id
// export const Currencies: Story = {
//   args: {
//     data: allCurrencies,
//     label: 'Currencies',
//     renderAsValue: false,
//     onCreate: (name?) => action('onCreate')(name),
//   },
// }
