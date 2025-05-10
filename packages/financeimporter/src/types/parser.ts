import type { Account } from './account'
import type { Category } from './category'
import type { Transaction } from './transaction'

/**
 * Output of a parser
 */
export interface ParsedData {
  /**
   * List of parsed accounts from data if available
   */
  accounts?: Account[]
  /**
   * List of parsed categories from data if available
   */
  categories?: Category[]
  /**
   * List of parsed transaction from data
   */
  transactions: Transaction[]
}

/**
 * Base Modal class for data parsers
 */
export interface Parser {
  /**
   * Function to parse the string data into a ParsedData object
   *
   * @param fileData The file data as string to parse
   * @param args     Optionally provide additional arguments for specific
   *                 parsers  (e.g. CSVParser takes a mapper argument)
   * @returns        A promise that resolves to a ParsedData object
   */
  parse(fileData: string, ...args: any): Promise<ParsedData>
}
