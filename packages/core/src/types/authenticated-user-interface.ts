/**
 * Interface for Authenticated User model
 */
export interface IAuthenticatedUser {
  /** Cloud UUID for User **/
  id: string

  /* Created On Date/Time */
  created_on: Date

  /* Modified On Date/Time */
  modified_on: Date

  /* First name of User */
  first_name: string

  /* Last name of User */
  last_name: string

  /** Email for User **/
  email: string

  /* User Avatar as Base64 encoded string */
  avatar?: string

  /* Phone number of user in E.164 spec compliant, i.e. +141533322222 */
  phone?: string
}

/**
 * Interface for AuthenticatedUser Update Model
 */
export type IAuthenticatedUserUpdate = {
  /* First name of User */
  first_name?: IAuthenticatedUser['first_name']

  /* Last name of User */
  last_name?: IAuthenticatedUser['last_name']

  /* Phone number of user in E.164 spec compliant, i.e. +141533322222 */
  phone?: IAuthenticatedUser['phone']

  /* User Avatar as Base64 encoded string */
  avatar?: IAuthenticatedUser['avatar']
}
