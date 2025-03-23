import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'

import type { ITag } from '@angelfish/core'
import { tags } from '@angelfish/tests/fixtures'
import { AutocompleteField } from '.'

const meta = {
  title: 'Components/Forms/Autocomplete Field',
  component: AutocompleteField,
  args: {
    onChange: (event, value, reason, details) => action('onChange')(event, value, reason, details),
    getOptionLabel: (option) => (option as ITag).name,
    options: tags,
  },
  render: ({ ...args }) => {
    return (
      <Paper>
        <AutocompleteField {...args} />
      </Paper>
    )
  },
} satisfies Meta<typeof AutocompleteField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const SingleSelect: Story = {
  args: {
    label: 'Singleselect Autocomplete Field',
    multiple: false,
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
    placeholder: 'Select a tag',
  },
}

export const MultiSelect: Story = {
  args: {
    label: 'Multiselect Autocomplete Field',
    multiple: true,
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
    filterSelectedOptions: true,
  },
}

export const CustomValueDisplay: Story = {
  args: {
    label: 'Custom Value Display Autocomplete Field',
    multiple: false,
    required: true,
    error: false,
    fullWidth: true,
    disabled: false,
    helperText: 'Here is some helper text',
    filterSelectedOptions: true,
    getStartAdornment: (value) => {
      const tag = value as ITag
      return (
        <img
          src="/assets/svg/flags/4x3/GB.svg"
          alt={tag?.name}
          width={20}
          style={{ marginRight: 10 }}
          loading="lazy"
        />
      )
    },
  },
}
