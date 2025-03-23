import type { AutocompleteProps, AutocompleteValue } from '@mui/material/Autocomplete'
import type { JSX } from 'react'

import type { FormFieldProps } from '../FormField'

/**
 * AutocompleteField Component Properties
 */
export interface AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
  /**
   * If `true`, the label is displayed in an error state.
   * @default false
   */
  error?: FormFieldProps['error']
  /**
   * Forwarded reference for FormField Control
   */
  formRef?: React.Ref<HTMLDivElement>
  /**
   * Function to render the start adornment (prefix) for the input field if
   * the selected value should be displayed as an adornment
   * (e.g. currency symbol, flag, emoji etc.)
   */
  getStartAdornment?: (
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
  ) => JSX.Element | null
  /**
   * The helper text content.
   * Optional, if not passed will not show any FormHelper Component
   */
  helperText?: FormFieldProps['helperText']
  /**
   * If `true`, the label is hidden.
   * This is used to increase density for a `FilledInput`.
   * Be sure to add `aria-label` to the `input` element.
   * @default false
   */
  hiddenLabel?: FormFieldProps['hiddenLabel']
  /**
   * The label content.
   * Optional, if not passed will not show any FormLabel Component
   */
  label?: FormFieldProps['label']
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   * @default 'none'
   */
  margin?: FormFieldProps['margin']
  /**
   * Placeholder text for the input field.
   * This is used when the `value` is empty and no `defaultValue` is provided.
   */
  placeholder?: string
  /**
   * If `true`, the label will indicate that the `input` is required.
   * @default false
   */
  required?: FormFieldProps['required']
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: FormFieldProps['size']
  /**
   * If true, will virtualize the listbox component for improved performance. This will
   * override the ListboxComponent property if provided.
   * @default false
   */
  virtualize?: boolean
}
