import type { FormFieldProps } from '../FormField'

/**
 * DateField Component Properties
 */

export interface DateFieldProps extends FormFieldProps {
  /**
   * ClassName applied to the root component.
   */
  className?: string
  /**
   * Disable past dates
   * @default false
   */
  disablePast?: boolean
  /**
   * Disable future dates
   * @default false
   */
  disableFuture?: boolean
  /**
   * Data field Locale (i.e. en, en-gb, ru etc.)
   * @default 'en'
   */
  locale?: string
  /**
   * Min selectable date
   * @default Date(1900-01-01)
   */
  minDate?: any
  /**
   * Max selectable date
   * @default Date(2100-01-01)
   */
  maxDate?: any
  /**
   * Optional onChange function to return current Currency after its changed
   */
  onChange?: (date: Date, value?: string) => void
  /**
   * Optionally set the current value for Field
   */
  value?: any
}
