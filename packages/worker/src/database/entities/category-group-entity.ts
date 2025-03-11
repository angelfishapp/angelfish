import { IsDate, IsDefined, IsHexColor, IsIn, IsOptional, IsString } from 'class-validator'
import moment from 'moment'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { CategoryGroupType, ICategoryGroup } from '@angelfish/core'
import { AccountEntity } from '.'

/**
 * Main Entity for a transaction Category Groups.
 *
 * Groups group together common categories so user's can see
 * their spending in a particular area
 */
@Entity({ name: 'category_groups' })
export class CategoryGroupEntity implements ICategoryGroup {
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

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  name!: string

  @Column()
  @IsDefined()
  @IsString()
  icon!: string

  @Column({ type: 'text' })
  @IsDefined()
  @IsIn(['Income', 'Expense'])
  type!: CategoryGroupType

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  description!: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsHexColor()
  color?: string

  @OneToMany((_type) => AccountEntity, (account) => account.categoryGroup)
  categories!: AccountEntity[]

  /**
   * Calculated Virtual Fields
   */

  total_categories: number = 0

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param categoryGroup The category group object to test and convert if needed
   * @returns             The object as a class instance
   */
  public static getClassInstance(
    categoryGroup: CategoryGroupEntity | ICategoryGroup | Partial<ICategoryGroup>,
  ): CategoryGroupEntity {
    if (!(categoryGroup instanceof CategoryGroupEntity)) {
      const newCategoryGroup: CategoryGroupEntity = Object.assign(
        new CategoryGroupEntity(),
        categoryGroup,
      )
      if (typeof newCategoryGroup.created_on === 'string') {
        newCategoryGroup.created_on = moment(newCategoryGroup.created_on).toDate()
      }
      if (typeof newCategoryGroup.modified_on === 'string') {
        newCategoryGroup.modified_on = moment(newCategoryGroup.modified_on).toDate()
      }
      return newCategoryGroup
    }
    return categoryGroup
  }
}
