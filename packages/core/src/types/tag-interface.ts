/**
 * Interface for Tag Model
 */

export interface ITag {
  /* Primary Key */
  id: number

  /* Creation date/time for Tag */
  created_on: Date

  /* Modified date/time for Tag */
  modified_on: Date

  /* Display name for Tag - must be unique */
  name: string
}

/**
 * Interface for creating a new Tag or updating an existing one in the database
 */
export interface ITagUpdate extends Omit<ITag, 'id' | 'created_on' | 'modified_on'> {
  /**
   * Optional primary key for Tag if updating an existing Tag in database
   * Leave blank if creating a new Tag.
   */
  id?: number
}
