import type { AutocompleteChangeReason, UseAutocompleteProps } from '@mui/material/useAutocomplete'
import type React from 'react'

import type { FormFieldProps } from '../FormField'

/**
 * Interface for the owner state of the MultiSelectField component.
 */
export interface MultiSelectFieldOwnerState<Value> {
  isOptionEqualToValue: (option: Value, value: Value) => boolean
  onChange?: (
    event: React.SyntheticEvent,
    value: Value[],
    reason: MultiSelectedFieldChangeReason,
    details: Value[],
  ) => void
  renderOption: (option: Value) => React.ReactNode
  selectedValues: Value[]
}

/**
 * onChange reasons for the MultiSelectField component.
 */
export type MultiSelectedFieldChangeReason =
  | AutocompleteChangeReason
  | 'selectAll'
  | 'removeAll'
  | 'selectGroup'
  | 'removeGroup'

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
   * onChange event handler called whenever the selected options change.
   *
   * @param event       The event object.
   * @param value       The new value of the select field.
   * @param reason      The reason for the change.
   * @param details     Additional details about the change.
   * @default undefined
   */
  onChange?: (
    event: React.SyntheticEvent,
    value: Value[],
    reason: MultiSelectedFieldChangeReason,
    details: Value[],
  ) => void
  /**
   * Render the option, use `getOptionLabel` by default.
   * @default `getOptionLabel`
   */
  renderOption?: (option: Value) => React.ReactNode
}
