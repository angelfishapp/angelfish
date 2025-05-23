import type { FormFieldProps } from '@/components/forms/FormField'

/**
 * AmountField Component Properties
 */

export interface AmountFieldProps
  extends Omit<FormFieldProps, 'defaultValue' | 'onChange' | 'value'> {
  /**
   * Optionally allow negative values
   * @default false
   */
  allowNegative?: boolean
  /**
   * Optionally display currency for Amount
   * @default '$'
   */
  currency?: string
  /**
   * Optionally set the default value for Field
   */
  defaultValue?: number
  /**
   * Callback for when value is changed
   */
  onChange?: (value: number) => void
  /**
   * Optionally set value when using as Controlled field
   */
  value?: number
}
