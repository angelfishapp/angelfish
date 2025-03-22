import type { ITag, ITagUpdate } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * TagsField Component Properties
 */

export interface TagsFieldProps extends FormFieldProps {
  /**
   * Full list of Tags in the Database
   */
  tags: ITag[]
  /**
   * Callback for when value is changed
   */
  onChange: (tags: ITagUpdate[]) => void
  /**
   * Optionally set the current value for Field
   */
  value?: ITag[] | null
}
