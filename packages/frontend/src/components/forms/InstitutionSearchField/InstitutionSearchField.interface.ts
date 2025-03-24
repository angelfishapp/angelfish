import type { IInstitutionUpdate } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * InstitutionSearchField Component Properties
 */
export interface InstitutionSearchFieldProps extends FormFieldProps {
  /**
   * Optional onChange function to return current input value (name)
   * after its changed. If user selected a search result with additional
   * institution details, that will also be returned as the 2nd parameter
   * in the callback.
   */
  onChange?: (name: string, institution?: IInstitutionUpdate) => void
  /**
   * Async Callback to power autocomplete search as user searches
   * remote Institutions from Cloud API
   */
  onSearch: (query: string) => Promise<IInstitutionUpdate[]>
  /**
   * Optional placeholder for the TextField
   * @default 'Type in Institution Name...'
   */
  placeholder?: string
  /**
   * Optionally set the current name value for Field
   */
  value?: string
}
