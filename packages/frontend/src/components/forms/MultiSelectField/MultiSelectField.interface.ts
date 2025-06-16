
import type { Currency, IAccount, ITag } from '@angelfish/core'
import type { FormFieldProps } from '../FormField'
import type { IInstitution } from '@angelfish/core/src/types'

/**
 * CategoryField Component Properties
 */

export interface MultiSelectFieldProps extends FormFieldProps {
  /**
   * Accounts that can be rendered with their related
   * CategoryGroup & Institution fields populated
   */
  data: Array<IAccount | IInstitution | ITag |Currency  >
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
   * Callback for when value is changed
   */
  onChange?: (account: IAccount[] | IAccount | string | null) => void
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
}
