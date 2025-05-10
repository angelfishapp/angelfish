/**
 * Represents an entire QIF file's data.
 */
export type QifData =
  | {
      type:
        | QifType.Bank
        | QifType.Cash
        | QifType.Card
        | QifType.Investment
        | QifType.Asset
        | QifType.Liability
      transactions: QifTransaction[]
    }
  | {
      type: QifType.Category | QifType.Class
      categories: QifCategory[]
    }
  | {
      type: QifType.Account
      accounts: QifAccount[]
    }

/**
 * Enum of all possible QIF file types for a QIF file.
 */
export enum QifType {
  Cash = '!Type:Cash',
  Bank = '!Type:Bank',
  Card = '!Type:CCard',
  Investment = '!Type:Invst',
  Asset = '!Type:Oth A',
  Liability = '!Type:Oth L',
  Invoice = '!Type:Invoice',
  Account = '!Account',
  Category = '!Type:Cat',
  Class = '!Type:Class',
  Memorized = '!Type:Memorized',
  Security = '!Type:Security',
}

/**
 * Represents a single item from a Qif file, with all associated item fields.
 *
 * @public
 */
export type QifTransaction = {
  date?: string // D
  amount?: number // T
  clearedStatus?: string // C
  reference?: string // N
  payee?: string // P
  memo?: string // M
  address?: string[] // A
  category?: string // L

  splits?: QifSplit[]

  investmentAction?: string // N
  investmentSecurity?: string // Y
  investmentPrice?: number // I
  investmentQuantity?: number // Q
  investmentReminder?: string // P
  investmentComission?: number // O
  investmentAccount?: string // L
  investmentAmountTransferred?: number // $
}

/**
 * Represents a split of a transaction.
 */
export type QifSplit = {
  category?: string // S
  memo?: string // E
  amount?: number // $
  percent?: number // %
}

/**
 * Represents a single account from a Qif file.
 */
export type QifAccount = {
  name?: string
  type?: string
  description?: string
  creditLimit?: number
  balance?: number
  balanceDate?: string
}

/**
 * Represents a single category from a Qif file.
 */
export type QifCategory = {
  name?: string
  description?: string
  type?: 'income' | 'expense'
}

/**
 * Error Class for Parser Errors.
 */
export class QifParserError extends Error {}
