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
 * CSVHeader represents a column header in a CSV file with
 * Sample values from the column
 *
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
