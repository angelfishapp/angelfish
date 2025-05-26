import type { FilterOptionsState } from '@mui/material/useAutocomplete'

import type { IAccount } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * CategoryField Component Properties
 */

export interface MultiSelectFieldProps extends FormFieldProps {
  /**
   * Accounts that can be rendered with their related
   * CategoryGroup & Institution fields populated
   */
  accountsWithRelations: IAccount[]
  /**
   * Optionally disable the GroupBy feature so categories
   * do not appear in groupings in AutoComplete
   * @default false
   */
  disableGroupBy?: boolean
  /**
   * Optionally disable the description Tooltip on the rendered option
   * @default false
   */
  disableTooltip?: boolean
  /**
   * Optional filter function to filter the accounts BEFORE rendering
   */
  filter?: (account: IAccount) => boolean
  /**
   * A filter function to filter the options AFTER rendering
   */
  filterOptions?: (options: IAccount[], state: FilterOptionsState<IAccount>) => IAccount[]
  /**
   * Callback for when value is changed
   */
  onChange: (account:IAccount[]| IAccount | string | null) => void
  /**
   * Callback for when user creates a new category. Will
   * pass any existing value in search field if present to
   * save user time typing name in again. If not provided the
   * ability to create a new Category will be disabled.
   */
  onCreate?: (name?: string) => void
  /**
   * Optional placeholder for the TextField
   * @default 'Search Categories...'
   */
  placeholder?: string
  /**
   * Disable showing rendered value instead of TextField if false
   * @default true
   */
  renderAsValue?: boolean
  /**
   * Optionally set the current value for Field
   */
  value?: any
  /**
   * Optionally set AutomComplete list to be Open
   * @default false
   */
  open?: boolean
  /**
   * requiered set the variant to be dropdown or multi-box
   * @default false
   */
  variant?: 'dropdown' | 'multi-box'
}
