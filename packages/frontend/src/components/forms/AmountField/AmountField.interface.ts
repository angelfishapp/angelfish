import type { FormFieldProps } from '@/components/forms/FormField'
import type { CurrencyCode } from '@angelfish/core'

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
   * 3-digit alphabetic currency codes from the ISO 4217 Currency Codes
   * @default 'USD'
   */
  currency?: CurrencyCode
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
