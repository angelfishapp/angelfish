/**
 * interface for Parsed Account from data
 */
export interface Category {
  /**
   * Category ID
   */
  id?: number
  /**
   * Name of the Category
   */
  name: string
  /**
   * Description of the Category
   */
  description?: string
  /**
   * Type of the Category
   */
  type?: 'income' | 'expense'
}
