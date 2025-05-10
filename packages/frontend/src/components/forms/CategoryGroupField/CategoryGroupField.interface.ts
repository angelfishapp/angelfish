import type { ICategoryGroup } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * CategoryGroupField Component Properties
 */
export interface CategoryGroupFieldProps extends FormFieldProps {
  /**
   * Array of CategoryGroups in Database
   */
  categoryGroups: ICategoryGroup[]
  /**
   * Optional onChange function to return new value of select and the previous value of the select
   */
  onChange?: (value?: ICategoryGroup, prev?: ICategoryGroup) => void
  /**
   * Optional placeholder for the TextField
   * @default 'Search Category Groups...'
   */
  placeholder?: string
  /**
   * Optionally set the current value for Field
   */
  value?: ICategoryGroup
}
