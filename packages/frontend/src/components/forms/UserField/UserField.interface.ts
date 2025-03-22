import type { IUser } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * UserField Component Properties
 */

export interface UserFieldProps extends FormFieldProps {
  /**
   * Array of available Users to select from
   */
  users: IUser[]
  /**
   * Optional onChange function to return selected Users after its changed
   */
  onChange?: (users: IUser[] | null) => void
  /**
   * Optionally set the current value for Field
   */
  value?: IUser[]
}
