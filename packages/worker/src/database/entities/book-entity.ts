import { IsBase64, IsDate, IsDefined, IsIn, IsOptional, IsString } from 'class-validator'
import moment from 'moment'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import type { IBook, IBookUpdate } from '@angelfish/core'
import { IsCountry, IsCurrencyCode } from './validators'

/**
 * Main Entity for a Book.
 *
 * A book is the overall entity (account) that represents the household
 * or business. All data belongs to a single book and only one book will be stored in the database
 * to represent the household/business
 */
@Entity({ name: 'book' })
export class BookEntity implements IBook {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  @IsOptional()
  @IsDate()
  created_on!: Date

  @UpdateDateColumn()
  @IsOptional()
  @IsDate()
  modified_on!: Date

  @Column()
  @IsDefined()
  @IsString()
  name!: string

  /**
   * @default 'HOUSEHOLD'
   */
  @Column({ type: 'text', default: 'HOUSEHOLD' })
  @IsDefined()
  @IsIn(['HOUSEHOLD', 'BUSINESS'])
  entity!: 'HOUSEHOLD' | 'BUSINESS'

  @Column({ type: 'text' })
  @IsDefined()
  @IsCountry()
  country!: string

  @Column({ type: 'text' })
  @IsDefined()
  @IsCurrencyCode()
  default_currency!: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsBase64()
  logo!: string

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param book      The book object to test and convert if needed
   * @returns         The object as a class instance
   */
  public static getClassInstance(book: IBook | IBookUpdate | BookEntity) {
    if (!(book instanceof BookEntity)) {
      const newBook: BookEntity = Object.assign(new BookEntity(), book)
      if (typeof newBook.created_on === 'string') {
        newBook.created_on = moment(newBook.created_on).toDate()
      }
      if (typeof newBook.modified_on === 'string') {
        newBook.modified_on = moment(newBook.modified_on).toDate()
      }
      return newBook
    }
    return book
  }
}
