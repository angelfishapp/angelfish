import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import type { ITag } from '@angelfish/core'
import { tags as tagsData } from '@angelfish/tests/fixtures'
import TagsField from './TagsField'

/**
 * Story Book Meta
 */

const meta = {
  title: 'Components/Forms/Tags Field',
  component: TagsField,
  args: {
    tags: tagsData,
    onChange: (tags) => action('onChange')(tags),
  },
  render: ({ onChange, tags, value, ...args }) => {
    const RenderComponent = () => {
      const [updatedTags, setUpdatedTags] = React.useState<ITag[]>(tags)
      const [selectedTags, setSelectedTags] = React.useState<ITag[]>([])

      return (
        <Paper>
          <TagsField
            value={selectedTags}
            tags={updatedTags}
            onChange={(tags) => {
              onChange?.(tags)
              // Convert ITagUpdate[] to ITag[]
              const newSelectedTags = tags.map((tag) => {
                if ('id' in tag) {
                  return updatedTags.find((t) => t.id === tag.id)
                }
                // Otherwise, create a new tag
                const newTag: ITag = {
                  id: updatedTags.length + 1,
                  name: tag.name,
                  created_on: new Date(),
                  modified_on: new Date(),
                }
                setUpdatedTags([...updatedTags, newTag])
                return newTag
              })
              setSelectedTags(newSelectedTags as ITag[])
            }}
            {...args}
          />
        </Paper>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof TagsField>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    label: 'Tags Field',
    fullWidth: true,
  },
}
