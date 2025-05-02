import {
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import moment from 'moment'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { ITransaction, ITransactionUpdate } from '@angelfish/core'
import { AccountEntity, LineItemEntity } from '.'
import { IsCurrencyCode, IsLineItemsValid } from './validators'

/**
 * Main Entity for transaction.
 */
@Entity({ name: 'transactions' })
export class TransactionEntity implements ITransaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  date!: Date

  @CreateDateColumn()
  @IsOptional()
  @IsDate()
  created_on!: Date

  @UpdateDateColumn()
  @IsOptional()
  @IsDate()
  modified_on!: Date

  /* Additional column for bulk inserts */
  @Column({ type: 'integer' })
  @IsDefined()
  @IsInt()
  account_id!: number
  @ManyToOne((_type) => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account!: AccountEntity

  @Column({
    type: 'text',
    transformer: {
      to: (value: number): string => value.toString(),
      from: (value: string): string => value.toString(),
    },
  })
  @IsDefined()
  @IsString()
  title!: string

  @Column({ type: 'real', scale: 2 })
  @IsDefined()
  @IsNumber()
  amount!: number

  @Column({ type: 'text', nullable: true })
  @IsDefined()
  @IsCurrencyCode()
  currency_code!: string

  @Column({ default: true })
  @IsBoolean()
  requires_sync!: boolean

  @Column({ default: false })
  @IsBoolean()
  pending: boolean = false

  @Column({ default: false })
  @IsBoolean()
  is_reviewed: boolean = false

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value) => (value ? `${value}` : null),
      from: (value) => `${value}`,
    },
  })
  @IsOptional()
  @IsString()
  import_id?: string

  @OneToMany((_type) => LineItemEntity, (lineItem) => lineItem.transaction, {
    eager: true,
    cascade: true,
  })
  @IsDefined()
  @ArrayMinSize(1, { message: 'Transactions must have at least 1 Line Item' })
  @IsLineItemsValid()
  line_items!: LineItemEntity[]

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param transaction   The transaction object to test and convert if needed
   * @returns             The object as a class instance
   */
  public static getClassInstance(
    transaction: ITransaction | ITransactionUpdate | TransactionEntity,
  ) {
    if (!(transaction instanceof TransactionEntity)) {
      const newTransaction: TransactionEntity = Object.assign(new TransactionEntity(), transaction)
      if (typeof newTransaction.date === 'string') {
        newTransaction.date = moment(newTransaction.date).toDate()
      }
      if (typeof newTransaction.created_on === 'string') {
        newTransaction.created_on = moment(newTransaction.created_on).toDate()
      }
      if (typeof newTransaction.modified_on === 'string') {
        newTransaction.modified_on = moment(newTransaction.modified_on).toDate()
      }
      return newTransaction
    }
    return transaction
  }
}
