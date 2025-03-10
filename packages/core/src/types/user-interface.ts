/**
 * Interface for User Model
 */
export interface IUser {
  /* Primary ID for User */
  id: number

  /* Creation date/time for User */
  created_on: Date

  /* Last update date/time for User */
  modified_on: Date

  /* Email address of User */
  email: string

  /* First name of User */
  first_name: string

  /* Last name of User */
  last_name: string

  /* Unique UUID for User - same as Cloud APIs */
  cloud_id?: string

  /* User Avatar as Base64 encoded string */
  avatar?: string

  /* Phone number of user in E.164 spec compliant, i.e. +141533322222 */
  phone?: string
}

/**
 * Interface for User Update Model
 */
export interface IUserUpdate extends Omit<IUser, 'id' | 'created_on' | 'modified_on'> {
  /* User Primary ID to update if already exists */
  id?: number

  /* Creation date/time for User if already exists */
  created_on?: Date
}
