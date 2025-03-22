import type { TextFieldProps } from '@/components/forms/TextField'

/**
 * AmountField Component Properties
 */

export interface AmountFieldProps
  extends Omit<
    TextFieldProps,
    'defaultValue' | 'onChange' | 'inputComponent' | 'placeholder' | 'value'
  > {
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
