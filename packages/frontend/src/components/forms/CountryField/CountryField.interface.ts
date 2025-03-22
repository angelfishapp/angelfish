import type { Country } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * CountryField Component Properties
 */

export interface CountryFieldProps extends FormFieldProps {
  /**
   * Optional onChange function to return current Country after its changed
   */
  onChange?: (country: Country | null) => void
  /**
   * Optionally set the current value for Field
   */
  value?: Country | string
}
