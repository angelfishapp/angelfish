import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'
import moment from 'moment'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { CategoryType, IAccount } from '@angelfish/core'
import { AccountTypes } from '@angelfish/core'
import { CategoryGroupEntity, InstitutionEntity, UserEntity } from '.'
import { IsBankAccountSubType, IsCurrencyCode } from './validators'

/**
 * Main Entity for Account to assign Line Items too.
 */
@Entity({ name: 'accounts' })
export class AccountEntity implements IAccount {
  /**
   * Common Fields
   */

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
  @IsIn(['CATEGORY', 'ACCOUNT'])
  class!: 'CATEGORY' | 'ACCOUNT'

  /* Category Group Account belongs to
        Need to add colum as well as join for bulk inserts */
  @Column()
  @ValidateIf((acc) => acc.class === 'CATEGORY')
  @IsDefined()
  @IsInt()
  cat_group_id?: number
  @ManyToOne((_type) => CategoryGroupEntity)
  @JoinColumn({ name: 'cat_group_id' })
  categoryGroup?: CategoryGroupEntity

  /* Institution Account belongs to
        Need to add colum as well as join for bulk inserts */
  @Column()
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsDefined()
  @IsInt()
  acc_institution_id?: number
  @ManyToOne((_type) => InstitutionEntity)
  @JoinColumn({ name: 'acc_institution_id' })
  institution?: InstitutionEntity

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  name!: string

  /**
   * Category Fields
   */

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'CATEGORY')
  @IsDefined()
  @IsString()
  // TODO Add CategoryType Validator
  cat_type?: CategoryType

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'CATEGORY')
  @IsOptional()
  @IsString()
  cat_description?: string

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'CATEGORY')
  @IsString()
  cat_icon?: string

  /**
   * Bank Account Fields
   */

  // Manage account owner relations for ACCOUNT class accounts
  @ManyToMany(() => UserEntity, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'account_owners',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsDefined()
  @IsArray()
  acc_owners?: UserEntity[]

  // Need to force field to return as string when just numbers
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value) => (value ? `${value}` : null),
      from: (value) => `${value}`,
    },
  })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsString()
  acc_sort?: string

  // Need to force field to return as string when just numbers
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value) => (value ? `${value}` : null),
      from: (value) => `${value}`,
    },
  })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsString()
  acc_number?: string

  // Need to force field to return as string when just numbers
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value) => (value ? `${value}` : null),
      from: (value) => `${value}`,
    },
  })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsString()
  acc_mask?: string

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsDefined()
  @IsIn(AccountTypes)
  acc_type?: string

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsDefined()
  @IsBankAccountSubType()
  acc_subtype?: string

  @Column({ type: 'text', nullable: true })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsDefined()
  @IsCurrencyCode()
  acc_iso_currency?: string

  /**
   * @default 0.0
   */
  @Column({ type: 'real', default: 0.0, precision: 10, scale: 2 })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsNumber()
  acc_start_balance: number = 0.0

  /**
   * @default 0.0
   */
  @Column({ type: 'real', default: 0.0, precision: 10, scale: 2 })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsNumber()
  acc_interest_rate: number = 0.0

  /**
   * @default 0.0
   */
  @Column({ type: 'real', default: 0.0, precision: 10, scale: 2 })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsNumber()
  acc_limit: number = 0.0

  /**
   * @default true
   */
  @Column({ default: true })
  @ValidateIf((acc) => acc.class === 'ACCOUNT')
  @IsOptional()
  @IsBoolean()
  acc_is_open?: boolean = true

  /*
   * Calculated Virtual Fields
   */

  /**
   * Current Balance of the Account from Database
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    insert: false,
    update: false,
    select: false,
  })
  current_balance: number = 0.0

  /**
   * Current Balance of the Account in Book's default currency
   */
  local_current_balance: number = 0.0

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param account   The account object to test and convert if needed
   * @returns         The object as a class instance
   */
  public static getClassInstance(
    account: Partial<AccountEntity> | IAccount | Partial<IAccount>,
  ): AccountEntity {
    if (!(account instanceof AccountEntity)) {
      const newAccount: AccountEntity = Object.assign(new AccountEntity(), account)
      if (typeof newAccount.created_on === 'string') {
        newAccount.created_on = moment(newAccount.created_on).toDate()
      }
      if (typeof newAccount.modified_on === 'string') {
        newAccount.modified_on = moment(newAccount.modified_on).toDate()
      }
      if (Array.isArray(newAccount.acc_owners)) {
        const owners: UserEntity[] = []
        for (const owner of newAccount.acc_owners) {
          if (!(owner instanceof UserEntity)) {
            owners.push(UserEntity.getClassInstance(owner))
          } else {
            owners.push(owner)
          }
        }
        newAccount.acc_owners = owners
      }
      return newAccount
    }
    return account
  }
}
