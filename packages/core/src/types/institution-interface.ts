import type { IAccount } from './account-interface'

/**
 * Interface for Institution Model
 */
export interface IInstitution {
  /* Primary Key */
  id: number

  /* Date/time Institution was linked/created */
  created_on: Date

  /* Last update date/time for Institution */
  modified_on: Date

  /* Is Institution still Open (True) or has user closed all accounts with it */
  is_open: boolean

  /* Name of the Institution displayed, i.e. Wells Fargo */
  name: string

  /* Country Institution is based in (ISO-3166-1 alpha-2 country code standard) */
  country: string

  /* Base64 encoded representation of the institution's logo */
  logo?: string

  /* Hexadecimal representation of the primary color used by the institution */
  primary_color?: string

  /* The URL for the institution's website */
  url?: string

  /* List of Accounts linked to Institution */
  accounts: IAccount[]
}

/**
 * Interface to update or create an Institution
 */
export interface IInstitutionUpdate
  extends Partial<Omit<IInstitution, 'name' | 'country' | 'accounts' | 'current_balance'>> {
  /* Name - required */
  name: string
  /* Country - required */
  country: string
}
