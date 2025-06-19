import type { UseAutocompleteProps } from '@mui/material/useAutocomplete'
import type React from 'react'

import type { FormFieldProps } from '../FormField'

/**
 * Interface for the owner state of the MultiSelectField component.
 */
export interface MultiSelectFieldOwnerState<Value> {
  renderOption: (option: Value) => React.ReactNode
}

/**
 * Props for the MultiSelectField component.
 */
export interface MultiSelectFieldProps<Value>
  extends FormFieldProps,
    Pick<
      UseAutocompleteProps<Value, true, false, false>,
      | 'defaultValue'
      | 'filterOptions'
      | 'getOptionDisabled'
      | 'getOptionLabel'
      | 'getOptionKey'
      | 'groupBy'
      | 'id'
      | 'isOptionEqualToValue'
      | 'onChange'
      | 'options'
      | 'value'
    > {
  /**
   * Forwarded reference for FormField Control
   */
  formRef?: React.Ref<HTMLDivElement>
  /**
   * Maximum height of the dropdown list.
   * @default 400
   */
  maxHeight?: number | string
  /**
   * Text to display when there are no options available.
   * @default 'No options'
   */
  noOptionsText?: string
  /**
   * Placeholder text for the input field.
   * This is used when the `value` is empty and no `defaultValue` is provided.
   */
  placeholder?: string
  /**
   * Render the option, use `getOptionLabel` by default.
   * @default `getOptionLabel`
   */
  renderOption?: (option: Value) => React.ReactNode
}
