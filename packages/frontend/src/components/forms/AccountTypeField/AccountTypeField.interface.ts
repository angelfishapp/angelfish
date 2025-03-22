import type { AccountType } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * AccountTypeField Component Properties
 */

export interface AccountTypeFieldProps extends FormFieldProps {
  /**
   * Optionally filter account types to specific country
   * using its ISO 3166-1 alpha-2 country code.
   * @default Will show all account types for all countries
   */
  country?: string
  /**
   * Optional onChange function to return current AccountType after its changed
   */
  onChange?: (type: AccountType | null) => void
  /**
   * Optionally filter account types to specific type as Angelfish will initially
   * exclude some account types like investment, loan, etc. so the user shouldn't be
   * able to select them.
   * @default ['depository', 'credit']
   */
  types?: string[]
  /**
   * Optionally set the current value for Field
   */
  value?: AccountType
}
