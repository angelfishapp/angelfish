/**
 * Interface for LineItem object parsed from data.
 *
 * LineItems will only be added if the Transaction contains a Category
 * or Split Transactions are present to ensure existing Categories and Splits
 * from imported files are maintained.
 */
export interface LineItem {
  /**
   * Category of the LineItem.
   */
  category: string
  /**
   * Amount of the LineItem.
   */
  amount: number
  /**
   * Memo of the LineItem.
   */
  memo?: string
}
