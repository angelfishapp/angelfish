/**
 * Interface for Book Model.
 *
 * A book is the overall entity (account) that represents the household or business.
 * All data belongs to a single book and only one book will be stored in the database
 * to represent the household/business
 */
export interface IBook {
  /* Primary Key */
  id: number

  /* Date/time Book (account for household/business) was created */
  created_on: Date

  /* Date/time Book (account for household/business) was last updated */
  modified_on: Date

  /* Name of household/business */
  name: string

  /**
   * Type of book
   * @default 'HOUSEHOLD'
   */
  entity: 'HOUSEHOLD' | 'BUSINESS'

  /**
   * Country where Household or Business is located (ISO-3166-1 alpha-2 country code standard)
   */
  country: string

  /**
   * Default Currency to Display Book Finances In (ISO 4217 currency code)
   */
  default_currency: string

  /**
   * Base64 Encoded Logo for Household
   */
  logo?: string
}

/**
 * Interface for Book Update Model
 */
export interface IBookUpdate extends Omit<IBook, 'id' | 'created_on' | 'modified_on'> {
  /* Primary Key */
  id?: number

  /* Date/time Book (account for household/business) was created */
  created_on?: Date
}
