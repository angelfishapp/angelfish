import type { Currency } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * CurrencyField Component Properties
 */

export interface CurrencyFieldProps extends FormFieldProps {
  /**
   * Optional onChange function to return current Currency after its changed
   */
  onChange?: (currency: Currency | null) => void
  /**
   * Optional placeholder for the TextField
   * @default 'Search Currencies...'
   */
  placeholder?: string
  /**
   * Optionally set the current value for Field
   */
  value?: Currency | string
}
