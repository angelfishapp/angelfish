import type { FormControlProps } from '@mui/material/FormControl'
import type { FormHelperTextProps } from '@mui/material/FormHelperText'
import type { FormLabelProps } from '@mui/material/FormLabel'

/**
 * FormField Component Properties
 */

export interface FormFieldProps
  extends Omit<
    FormControlProps,
    'onChange' | 'onBlur' | 'onFocus' | 'onKeyUp' | 'onKeyDown' | 'defaultValue' | 'variant'
  > {
  /**
   * Props applied to the [`FormHelperText`](/api/form-helper-text/) element.
   */
  FormHelperTextProps?: Partial<FormHelperTextProps>
  /**
   * The helper text content.
   * Optional, if not passed will not show any FormHelper Component
   */
  helperText?: React.ReactNode
  /**
   * The id of the `input` element.
   * Use this prop to make `label` and `helperText` accessible for screen readers.
   */
  id?: string
  /**
   * Props applied to the [`InputLabel`](/api/input-label/) element.
   */
  FormLabelProps?: Partial<FormLabelProps>
  /**
   * The label content.
   * Optional, if not passed will not show any FormLabel Component
   */
  label?: React.ReactNode
}
