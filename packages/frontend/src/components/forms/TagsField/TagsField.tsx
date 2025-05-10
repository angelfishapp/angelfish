import Chip from '@mui/material/Chip'
import React from 'react'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { ITag, ITagUpdate } from '@angelfish/core'
import type { TagsFieldProps } from './TagsField.interface'

/**
 * Tag Field, displays list of Tags and allows user to select or remove tags
 */

export default React.forwardRef<HTMLDivElement, TagsFieldProps>(function TagsField(
  { tags, onChange, value, id = 'tag-field', ...formFieldProps }: TagsFieldProps,
  ref,
) {
  /**
   * Sort Options
   */
  const sortedTags: ITag[] = React.useMemo(() => {
    return [...tags].sort()
  }, [tags])

  return (
    <AutocompleteField
      id={id}
      formRef={ref}
      {...formFieldProps}
      multiple
      freeSolo
      filterSelectedOptions
      options={sortedTags}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={value ? value : []}
      onChange={(_, newValue) => {
        const onChangeValue: ITagUpdate[] = newValue.map((tag) => {
          if (typeof tag === 'string') {
            return {
              name: tag,
            }
          }
          return {
            id: tag.id,
            name: tag.name,
          }
        })
        onChange(onChangeValue)
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option
        }
        return option.name
      }}
      renderTags={(tags, getTagProps) => {
        return tags.map((option, index) => {
          const tagProps = getTagProps({ index })
          return (
            <Chip
              key={tagProps.key}
              data-tag-index={tagProps['data-tag-index']}
              tabIndex={tagProps.tabIndex}
              onDelete={tagProps.onDelete}
              label={option.name}
            />
          )
        })
      }}
    />
  )
})
