import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { FileField } from '.'

const meta = {
  title: 'Components/Forms/File Field',
  component: FileField,
  args: {
    onChange: (value) => action('onChange')(value),
    onOpenFileDialog: async (multiple: boolean, fileTypes?: string[]) => {
      const files = await new Promise<FileList | null>((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = multiple
        if (fileTypes) {
          input.accept = fileTypes.join(',')
        }
        input.onchange = () => {
          resolve(input.files)
        }
        input.click()
      })

      // Convert FileList to string[] or string
      if (files) {
        const fileArray = Array.from(files)
        if (multiple) {
          return fileArray.map((file) => file.name)
        }
        return fileArray[0].name
      }

      return null
    },
    value: null,
    required: true,
    error: false,
    fullWidth: false,
    disabled: false,
  },
  render: ({ onChange, value, ...args }) => {
    const RenderComponent = () => {
      const [currentValue, setCurrentValue] = React.useState<string | string[] | null>(value)

      return (
        <Paper>
          <FileField
            onChange={(value) => {
              onChange?.(value)
              setCurrentValue(value)
            }}
            value={currentValue}
            {...args}
          />
        </Paper>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof FileField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'File Field',
    helperText: 'Click the button to select a file.',
  },
}

export const Multiple: Story = {
  args: {
    label: 'Multi-File Field',
    multiple: true,
  },
}

export const WithFileTypes: Story = {
  args: {
    label: 'Image File Field',
    placeholder: 'Select Images',
    fileTypes: ['image/png', 'image/jpeg'],
  },
}
