import type { SelectChangeEvent } from '@mui/material/Select'
import type { ReactNode } from 'react'

import type { FormFieldProps } from '../FormField'

/**
 * SelectField Component Properties
 */

export interface SelectFieldProps extends FormFieldProps {
  /**
   * If `true`, the width of the popover will automatically be set according to the items inside the
   * menu, otherwise it will be at least the width of the select input.
   * @default false
   */
  autoWidth?: boolean

  /**
   * The default element value. Use when the component is not controlled.
   * @document
   */
  defaultValue?: unknown

  /**
   * The icon that displays the arrow.
   */
  IconComponent?: React.ElementType

  /**
   * If `true`, `value` must be an array and the menu will support multiple selections.
   * @default false
   */
  multiple?: boolean

  /**
   * Name attribute of the `input` element.
   */
  name?: string

  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected.
   * @document
   */
  onChange?: (event: SelectChangeEvent<unknown>, child?: ReactNode) => void

  /**
   * Callback fired when the component requests to be closed.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: (event: React.SyntheticEvent) => void

  /**
   * Callback fired when the component requests to be opened.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onOpen?: (event: React.SyntheticEvent) => void

  /**
   * Control `select` open state.
   */
  open?: boolean

  /**
   * Render the selected value.
   *
   * @param {any} value The `value` provided to the component.
   * @returns {ReactNode}
   */
  renderValue?: (value: SelectFieldProps['value']) => React.ReactNode

  /**
   * The input value. Providing an empty string will select no options.
   * Set to an empty string `''` if you don't want any of the available options to be selected.
   *
   * If the value is an object it must have reference equality with the option in order to be selected.
   * If the value is not an object, the string representation must match with the string representation of the option in order to be selected.
   * @document
   */
  value?: unknown
}
