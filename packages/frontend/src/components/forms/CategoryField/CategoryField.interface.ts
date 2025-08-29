import type { FilterOptionsState } from '@mui/material/useAutocomplete'

import type { IAccount } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'

/**
 * CategoryField Component Common Properties
 */
interface CategoryFieldBaseProps extends FormFieldProps {
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
   * Optional placeholder for the TextField
   * @default 'Search Categories...'
   */
  placeholder?: string
}

/**
 * AutoComplete variant of CategoryField Props
 */
type AutoCompleteCategoryFieldProps = {
  /**
   * Optionally set the variant of the Field
   * @default 'autocomplete'
   */
  variant?: 'autocomplete'
  /**
   * Callback for when user creates a new category. Will
   * pass any existing value in search field if present to
   * save user time typing name in again. If not provided the
   * ability to create a new Category will be disabled.
   */
  onCreate?: (name?: string) => void
  /**
   * Callback for when value is changed
   */
  onChange: (account: IAccount | string | null) => void
  /**
   * Optionally set AutomComplete list to be Open
   * @default false
   */
  open?: boolean
  /**
   * Disable showing rendered value instead of TextField if false
   * @default true
   */
  renderAsValue?: boolean
  /**
   * Optionally set the current value for Field
   */
  value?: IAccount | null
}

/**
 * MultiSelect variant of CategoryField Props
 */
type MultiSelectCategoryFieldProps = {
  /**
   * Optionally set the groupBy function to group options
   * Will group by CategoryGroup name if not provided
   */
  groupBy?: (option: IAccount) => string
  /**
   * Callback for when value is changed
   */
  onChange: (account: IAccount[]) => void
  /**
   * Maximum height of the dropdown list.
   * @default 400
   */
  maxHeight?: number
  /**
   * Optionally set the variant of the Field
   * @default 'autocomplete'
   */
  variant: 'multiselect'
  /**
   * Optionally set the current value for Field
   */
  value?: IAccount[]
}

// Export the type for CategoryFieldProps
export type CategoryFieldProps = (AutoCompleteCategoryFieldProps | MultiSelectCategoryFieldProps) &
  CategoryFieldBaseProps
