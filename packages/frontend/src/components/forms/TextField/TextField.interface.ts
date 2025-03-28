import type { InputBaseComponentProps, InputBaseProps } from '@mui/material/InputBase'

import type { FormFieldProps } from '../FormField'

/**
 * TextField Component Properties
 */

export interface TextFieldProps extends FormFieldProps {
  /**
   * If `true`, the `input` element will be focused during the first mount.
   */
  autoFocus?: boolean
  /**
   * Should the browser autocomplete the input field
   * @default false (off)
   */
  autoComplete?: boolean
  /**
   * The default value of the `input` element.
   */
  defaultValue?: unknown
  /**
   * End `InputAdornment` for this component.
   */
  endAdornment?: React.ReactNode
  /**
   * The component used for the `input` element.
   * Either a string to use a HTML element or a component.
   */
  inputComponent?: React.ElementType<InputBaseComponentProps>
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: InputBaseComponentProps
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<InputBaseProps>
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<any>
  /**
   * If `true`, a textarea element will be rendered instead of an input.
   * @default false
   */
  multiline?: boolean
  /**
   * Name attribute of the `input` element.
   */
  name?: string
  /**
   * Callback fired when the input is blurred.
   *
   * Notice that the first argument (event) might be undefined.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder?: string
  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows?: string | number
  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  maxRows?: string | number
  /**
   * Start `InputAdornment` for this component.
   */
  startAdornment?: React.ReactNode
  /**
   * Type of the  text `input` element. Only supports text input types
   * @default 'text'
   */
  type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'url'
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: unknown
}
