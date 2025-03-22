import type {
  IAccount,
  IAuthenticatedUser,
  IBook,
  IInstitution,
  IInstitutionUpdate,
  IUser,
} from '@angelfish/core'

/**
 * SetupScreen Component Properties
 */

export interface SetupScreenProps {
  /**
   * Current User logged into App
   */
  authenticatedUser: IAuthenticatedUser
  /**
   * Current Book loaded in the App
   */
  book?: IBook
  /**
   * List of out of the box Base64 encoded Book Avatars for User to Select
   * during Setup
   */
  bookAvatars: string[]
  /**
   * List of out of the box Base64 encoded User Avatars for User to Select
   * during Setup
   */
  userAvatars: string[]
  /**
   * List of Users in the App
   */
  users: IUser[]
  /**
   * The bank Accounts in database with relations loaded
   */
  accountsWithRelations: IAccount[]
  /*
   * The Institutions in database
   */
  institutions: IInstitution[]
  /**
   * Callback to update user profile
   */
  onUpdateAuthenticatedUser: (firstName: string, lastName: string, avatar?: string) => void
  /**
   * Callback to create new Book
   */
  onCreateBook: (name: string, country: string, currency: string, logo?: string) => Promise<void>
  /**
   * Callback to create a new encryption key for Household
   */
  onCreateEncryptionKey: (seed: string) => void
  /**
   * Callback function to delete an existing User
   */
  onDeleteUser: (user: IUser) => void
  /*
   * Callback function to edit a User
   */
  onSaveUser: (user: IUser) => void
  /**
   * Callback function to delete an existing account
   */
  onDeleteAccount: (account: IAccount) => void
  /**
   * Callback function to delete an existing institution
   */
  onDeleteInstitution: (institution: IInstitution) => void
  /**
   * Async Callback to power autocomplete search as user searches
   * remote Institutions from Cloud API
   */
  onSearchInstitutions: (query: string) => Promise<IInstitutionUpdate[]>
  /**
   * Callback function to edit an account
   */
  onSaveAccount: (account: Partial<IAccount>) => void
  /**
   * Callback function to edit an institution
   */
  onSaveInstitution: (institution: IInstitutionUpdate) => void
  /**
   * Callback for when Setup is Completed All Steps
   */
  onComplete: () => void
}
