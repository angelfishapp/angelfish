import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import { getAccountsWithRelations } from '@angelfish/tests/fixtures'
import { institutions as INSTITUTIONS } from '@angelfish/tests/fixtures'
import { tags as tagsData } from '@angelfish/tests/fixtures'
import { allCurrencies,  } from '@angelfish/core'

import { MultiSelectField } from '.'
import { useState } from 'react'
import type { IAccount } from '@angelfish/core'

const meta = {
  title: 'Components/Forms/Multi Select Field',
  component: MultiSelectField,
  args: {
    fullWidth: true,
  },
  render: ({ ...args }) => {
    const RenderComponent =()=>{
    const [selected, setSelected] = useState<IAccount[]>([])

    return (
      <Paper>
        <MultiSelectField {...args}  value={selected} onChange={setSelected}/>
      </Paper>
    )
    }
    return <RenderComponent/>
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
    placeholder :'Search Categories...',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
  },
}
export const Institutions: Story = {
  args: {
    data: INSTITUTIONS,
    placeholder :'Search Institutions...',
    label: 'Institutions',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
  },
}
export const Tags: Story = {
  args: {
    data: tagsData,
    placeholder :'Search Tags...',
    label: 'Tags',
    renderAsValue: false,
    onCreate: (name?) => action('onCreate')(name),
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

