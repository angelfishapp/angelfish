import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import type { ILineItem } from '@angelfish/core'
import { AccountEntity, TagEntity, TransactionEntity } from '.'

/**
 * Main Entity for Transaction Line Item.
 */
@Entity({ name: 'line_items' })
export class LineItemEntity implements ILineItem {
  @PrimaryGeneratedColumn()
  id!: number

  /* Additional field for bulk inserts */
  @Column({ type: 'integer' })
  transaction_id!: number
  @ManyToOne((_type) => TransactionEntity, (transaction) => transaction.line_items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction!: TransactionEntity

  @Column({ type: 'integer', nullable: true })
  account_id?: number
  @ManyToOne((_type) => AccountEntity, (account) => account.id)
  @JoinColumn({ name: 'account_id' })
  account!: AccountEntity

  @Column({ type: 'real', precision: 10, scale: 2 })
  amount!: number

  @Column({ type: 'real', precision: 10, scale: 2 })
  local_amount!: number

  @Column({ type: 'text' })
  note!: string

  /**
   * Right now will not delete orphaned tags if removed from all line items
   * Will need to add SQLite trigger or Entity listener to do this
   */
  @ManyToMany(() => TagEntity, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'line_item_tags',
    joinColumn: { name: 'line_item_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags!: TagEntity[]
}
