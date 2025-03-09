import type { ParsedData, Parser } from '../types/parser'
import type { Transaction } from '../types/transaction'
import { parseDate } from '../utils'
import type { CSVHeader, CSVTransactionMapper } from './csv-parser-types'

/**
 * Parser for CSV Files. Unlike other parsers, this parser requires a mapper to map the CSV data to the Transaction object.
 * You can use getHeaders() to get the headers in the CSV file and use it to create the mapper.
 */
export class CSVParser implements Parser {
  /**
   * Use this function to parse the CSV File String Data
   *
   * @param fileData    The file data as string to parse
   * @param mapper      The mapper to use to map the data to the Transaction object
   * @param delimiter   The delimiter to use to split the row. Defaults to ','
   * @param isDDMMYY    Whether the date format is DD/MM/YY (true) or MM/DD/YY (false). Defaults to true
   * @returns           A promise that resolves to a ParsedData object
   */
  async parse(fileData: string, mapper: CSVTransactionMapper): Promise<ParsedData> {
    const lines = fileData.split('\n')
    const rows = lines
      .filter((row) => row !== '') // Remove empty rows
      .map((row) => this.parseCSVRow(row, mapper.settings.csv_delimiter))
    const headers = rows[0]

    // Create header/key map
    const map = new Map()
    for (const [key, value] of Object.entries(mapper.fields)) {
      map.set(value, key)
    }

    // Iterate through each row and map the data to the Transaction object
    const transactions: Transaction[] = rows.slice(1).map((row) => {
      const transaction: any = {}
      row.forEach((value, index) => {
        const header = headers[index]
        const key = map.get(header)
        if (key) {
          if (key === 'date') {
            transaction[key] = parseDate(
              value,
              mapper.settings.date_format === 'DD MM YY' ||
                mapper.settings.date_format === 'DD MM YYYY',
            )
          } else if (key === 'amount') {
            transaction[key] = parseFloat(value)
          } else {
            transaction[key] = value
          }
        }
      })
      return transaction as Transaction
    })

    return { accounts: [], transactions }
  }

  /**
   * Get the CSV headers in the file as an array of strings
   *
   * @param fileData   The file data as string to parse
   * @param delimiter  The delimiter to use to split the row. Defaults to ','
   * @returns          An array of CSVHeader objects representing the headers in the file
   */
  getHeaders(fileData: string, delimiter: string = ','): CSVHeader[] {
    const lines = fileData.split('\n')

    // If there is only one line, return the headers from that line
    if (lines.length >= 1) {
      const headers = this.parseCSVRow(lines[0], delimiter)
      // For each header get up to 5 sample values from the column
      return headers.map((header, index) => {
        const samples = lines.slice(1, 6).map((row) => {
          return this.parseCSVRow(row, delimiter)[index]
        })
        return { header, samples }
      })
    }
  }

  /**
   * Parse an individual row in the CSV file. Provides support for quoted string values
   * in the CSV file.
   *
   * @param row         The full row as string to parse
   * @param delimiter   The delimiter to use to split the row.
   * @returns           An array of strings representing the column values in the row
   */
  private parseCSVRow(row: string, delimiter: string): string[] {
    const columns: string[] = []
    let currentCol = ''
    let insideQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]

      // Toggle the insideQuotes flag if we encounter a quotation mark
      if (char === '"') {
        insideQuotes = !insideQuotes
        continue
      }

      // Add characters to the current column if we're inside quotes
      if (insideQuotes) {
        currentCol += char
        continue
      }

      // If we encounter the delimiter and we're not inside quotes, we've reached the end of a column
      if (char === delimiter && !insideQuotes) {
        columns.push(currentCol.trim())
        currentCol = ''
      } else {
        currentCol += char
      }
    }

    // Add the last column
    columns.push(currentCol.trim())
    return columns
  }
}
