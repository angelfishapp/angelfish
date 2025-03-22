import type { IAccount, ILineItem, ITag, ITransaction, IUser, SplitLineItem } from '@angelfish/core'

/**
 * Type for Transaction Row
 */

export interface TransactionRow {
  // parent attributes (also duplicate in childs)
  tid: number
  title: string
  date: Date
  account: IAccount
  owners?: IUser[]
  currency?: string
  isReviewed: boolean
  transaction: ITransaction

  // Flag to keep track of split transactions
  isSplit: boolean

  // Flag to keep track of new rows
  isNew: boolean

  // child attributes
  line_item_id?: ILineItem['id']
  category?: IAccount
  amount: number
  balance?: number
  tags?: ITag[]
  note?: string

  // child rows
  rows?: TransactionRow[]
}

/**
 * Form Data for TableRowEdit
 */

export type FormData = {
  title: string
  amount: number
  date: Date
  is_reviewed: boolean
  lineItems: SplitLineItem[]
}
