import type { IInstitution } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * InstitutionField Component Properties
 */
export interface InstitutionFieldProps extends FormFieldProps {
  /**
   * List of available Institutiosn to select from
   */
  institutions: IInstitution[]
  /**
   * Optional onChange function to return selected institution
   */
  onChange?: (institution: IInstitution) => void
  /**
   * Optional placeholder for the TextField
   * @default 'Search Institutions...'
   */
  placeholder?: string
  /**
   * Optionally set the current value for Field
   */
  value?: IInstitution
}
