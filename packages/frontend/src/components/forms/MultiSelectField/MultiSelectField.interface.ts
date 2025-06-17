import type { FormFieldProps } from '../FormField'

export interface MultiSelectFieldProps<T> extends FormFieldProps {
  /**
   * The list of options to select from
   */
  data: T[]

  /**
   * Disable the GroupBy feature
   */
  disableGroupBy?: boolean

  /**
   * Disable the description Tooltip
   */
  disableTooltip?: boolean

  /**
   * Callback when selection changes
   */
  onChange: (items: T[]) => void

  /**
   * Callback when user creates a new item
   */
  onCreate?: (name: string) => void

  /**
   * Placeholder text
   */
  placeholder?: string

  /**
   * Show selected values instead of the input field
   */
  renderAsValue?: boolean

  /**
   * Selected value
   */
  value: T[]

  /**
   * Whether Autocomplete is open
   */
  open?: boolean

  /**
   * Label for the field
   */
  label: string
}
