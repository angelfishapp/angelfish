import type { ITransactionUpdate } from './transaction-interface'

/**
 * Supported file type extensions for importing transactions
 */
export type ImportFileType =
  | 'ofx'
  | 'qfx'
  | 'qif'
  | 'csv'
  | 'pdf'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'heic'
  | 'heif'

/**
 * CSVHeader represents a column header in a CSV file with sample values from the column
 *
 * @see @angelfish/financeimporter/src/csv/CSVParser.types.ts
 * @example { header: 'Date', samples: ['2021-01-01', '2021-01-02', '2021-01-03'] }
 */
export interface CSVHeader {
  /**
   * The column header name
   */
  header: string
  /*
   * Some sample values from the column (up to 5)
   */
  samples: string[]
}

/**
 * ParsedAccount represents an account found in a file that Transactions can be mapped to
 */
export interface ParsedAccount {
  /**
   * Bank ID for Account
   */
  id: string
  /**
   * Name of the account
   */
  name: string
}

/**
 * ParsedFileMappings is a collection of mappings for the Import service to use to map file data
 * after its initially parsed. These are then used to send mappings via the ImportTransactionsMapper
 * to the service to correctly map file data to the ITransaction interface.
 */
export interface ParsedFileMappings {
  /**
   * The file type extension of the file that was parsed
   */
  fileType: ImportFileType
  /**
   * Headers with samples found in a CSV file
   */
  csvHeaders?: CSVHeader[]
  /**
   * Array of Parsed Accounts, if any, found in the file
   * so Transactions can be mapped to the correct account
   * when importing.
   */
  accounts?: ParsedAccount[]
  /**
   * Array of Category names, if any, found in the file so Transactions
   * can be mapped to the correct category when importing.
   */
  categories?: string[]
  /**
   * Optional start date for AI extraction to help contextualize transaction dates
   */
  startDate?: Date
}

/**
 * CSVTransactionMapper maps column headers from CSV file to Transaction fields
 *
 * @see @angelfish/financeimporter/src/csv/CSVParser.types.ts
 */
export interface CSVTransactionMapper {
  /**
   * Mappings for the CSV file column headers to Transaction fields
   */
  fields: {
    id?: string
    date: string
    name: string
    memo?: string
    amount: string
    pending?: string
    iso_currency_code?: string
    transaction_type?: string
    check_number?: string
  }
  /**
   * Settings for the CSV file import
   */
  settings: {
    /**
     * The date format of the CSV file
     */
    date_format: 'YYYY MM DD' | 'YY MM DD' | 'MM DD YYYY' | 'MM DD YY' | 'DD MM YYYY' | 'DD MM YY'
    /**
     * The delimiter used in the CSV file
     */
    csv_delimiter: ',' | ';'
  }
}

/**
 * Main Interface for sending Mappings for the Import service to use to map file data
 * correctly to the ITransaction interface.
 */
export interface ImportTransactionsMapper {
  /**
   * The file type extension of the file being imported
   */
  fileType: ImportFileType
  /**
   * If the file contains Transactions without any account_id, the defaultAccountId
   * will be used for those Transactions. Useful for files that don't contain account_id
   * but all Transactions should be imported into a specific account.
   */
  defaultAccountId: number
  /**
   * Mapper for the 'csv' fileType
   */
  csvMapper?: CSVTransactionMapper
  /**
   * Mapper if file contains multiple accounts where Transactions need to be mapped
   * to different accounts to be imported correctly. Uses the string Account ID found
   * in the file to map to the Account ID in the database.
   *
   * @example { 'FileAccountID1': 1, 'FileAccountID2': 2 }
   */
  accountsMapper?: Record<string, number>
  /**
   * Mapper if file contains multiple categories where Transactions need to be mapped
   * to different categories to be imported correctly. Uses the string Category Name
   * found in the file to map to the Category ID in the database.
   *
   * @example { 'Food: Groceries': 1, 'Car:Petrol': 2 }
   */
  categoriesMapper?: Record<string, number>
  /**
   * Optional start date for AI extraction to help contextualize transaction dates
   */
  startDate?: Date
}

/**
 * Provides additional fields for the ITransaction interface to help with reconciling transactions
 * during import.
 */
export interface ReconciledTransaction extends ITransactionUpdate {
  /**
   * Flag to indicate if the Transaction should be imported (true) or not (false)
   */
  import: boolean
  /*
   * Status of the reconciliation process:
   *
   *   new:       New Transaction that needs to be imported into the account
   *   duplicate: Duplicate Transaction that already exists in the account
   *   transfer:  Reconciled as a Transfer between two of the user's bank accounts
   *              Will create a new Transaction in destination account if it doesn't exist
   *              otherwise if the destination account has a matching Transaction it will
   *              update the existing Transaction with the reconciled data.
   */
  reconciliation: 'new' | 'duplicate' | 'transfer'
}
