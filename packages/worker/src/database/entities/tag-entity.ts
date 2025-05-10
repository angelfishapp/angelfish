import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator'
import moment from 'moment'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import type { ITag, ITagUpdate } from '@angelfish/core'

/**
 * Tag for Taggig line items.
 */
@Entity({ name: 'tags' })
export class TagEntity implements ITag {
  @PrimaryGeneratedColumn()
  id!: number

  @IsOptional()
  @IsDate()
  @CreateDateColumn()
  created_on!: Date

  @UpdateDateColumn()
  @IsOptional()
  @IsDate()
  modified_on!: Date

  @Column({ type: 'text', unique: true })
  @IsDefined()
  @IsString()
  name!: string

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param tag   The tag object to test and convert if needed
   * @returns     The object as a class instance
   */
  public static getClassInstance(tag: TagEntity | ITag | ITagUpdate): TagEntity {
    if (!(tag instanceof TagEntity)) {
      const newTag: TagEntity = Object.assign(new TagEntity(), tag)
      if (typeof newTag.created_on === 'string') {
        newTag.created_on = moment(newTag.created_on).toDate()
      }
      if (typeof newTag.modified_on === 'string') {
        newTag.modified_on = moment(newTag.modified_on).toDate()
      }
      return newTag
    }
    return tag
  }
}
