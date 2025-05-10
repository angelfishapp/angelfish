import type { ICategoryGroup } from './category-group-interface'
import type { IInstitution } from './institution-interface'
import type { IUser } from './user-interface'

/**
 * Category Types
 */
export type CategoryType =
  | 'Earned'
  | 'Passive'
  | 'Other'
  | 'Critical'
  | 'Important'
  | 'Optional'
  | 'Investment'

/**
 * Interface for Account model
 */
export interface IAccount {
  /**
   * Common Fields
   */

  /* Primary ID for Account */
  id: number

  /* Created On Date/Time */
  created_on: Date

  /* Date/time Account was last updated */
  modified_on: Date

  /* Type of account:
           CATEGORY - This is a Category account such as 'Eating Out' to assign line items to
           ACCOUNT - This is a bank account such as 'Wells Fargo Checking' to assign line items to 
   */
  class: 'CATEGORY' | 'ACCOUNT'

  /* Display name for Account */
  name: string

  /**
   * Category Fields
   */

  /* CategoryGroup ID Account belongs too if class is 'CATEGORY' */
  cat_group_id?: number

  /* CategoryGroup Account belongs too if class is 'CATEGORY' */
  categoryGroup?: ICategoryGroup

  /* Category Type, depends on whether part of Income or Expense Category Group:
      Income: Earned, Passive, Other
      Expense: Critical, Important, Optional, Investment */
  cat_type?: CategoryType

  /* Category Description */
  cat_description?: string

  /* Category Emoji Icon */
  cat_icon?: string

  /**
   * Bank Account Fields
   */

  /* Institution ID Account belongs to if class is 'ACCOUNT' */
  acc_institution_id?: number

  /* Institution Account belongs to if class is 'ACCOUNT' */
  institution?: IInstitution

  /* Array of Account owners for the Account. Can be jointly or singly owned */
  acc_owners?: IUser[]

  /* The full sort-code or routing number for the account */
  acc_sort?: string

  /* The full account number for the account */
  acc_number?: string

  /* The last 2-4 alphanumeric characters of an account's official account number. */
  acc_mask?: string

  /* Account Type: https://plaid.com/docs/api/accounts/#account-type-schema */
  acc_type?: string

  /* Account Sub-Type: https://plaid.com/docs/api/accounts/#account-type-schema */
  acc_subtype?: string

  /* The ISO-4217 currency code of the account or unofficial currency code associated with balance.
      Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as 
      cryptocurrencies and the currencies of certain countries. */
  acc_iso_currency?: string

  /* Account Starting/Opening Balance. */
  acc_start_balance?: number

  /**
   * Account Interest Rate for loan/credit account types.
   * @default 0.0
   */
  acc_interest_rate?: number

  /**
   * Account credit or overdraft limit for deposit or loan/credit account types.
   * @default 0.0
   */
  acc_limit?: number

  /**
   * Is the bank account open or closed?
   * @default true
   */
  acc_is_open?: boolean

  /*
   * Calculated Virtual Fields
   */

  /**
   * Calculated Balance of Account from Database. Will only
   * be set if the Account is class 'ACCOUNT'.
   *
   * @default 0.0
   */
  current_balance: number

  /**
   * Calculated Balance of Account from Database in Book's default currency. If
   * account currency is different from book's default currency, then this field
   * will be the currency_balance converted to book's default currency using the
   * latest spot exchange rates.
   *
   * Will only be set if the Account is class 'ACCOUNT'.
   *
   * @default 0.0
   */
  local_current_balance: number
}
