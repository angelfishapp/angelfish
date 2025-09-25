import fs from 'fs'

import type {
  AppCommandRequest,
  AppCommandResponse,
  IAccount,
  ILineItemUpdate,
  ITransaction,
  ParsedAccount,
  ReconciledTransaction,
} from '@angelfish/core'
import {
  AppCommandIds,
  Command,
  CommandsClient,
  createNewTransaction,
  updateTransaction,
} from '@angelfish/core'
import type {
  Account as ImportAccount,
  Transaction as ImportTransaction,
} from '@angelfish/financeimporter'
import { CSVParser, OfxParser, QifParser } from '@angelfish/financeimporter'
import { TransactionEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'
import { ReconciliationHelper } from './reconciliation-helper'

const logger = getWorkerLogger('ImportService')

/**
 * Imports transactions and other data from local files such as qfx, ofx, qif etc.
 */
class ImportServiceClass {
  /**
   * Read an OFX, QFX, QIF, CSV, PDF or Image File. Will get transactions from the file and then reconcile them with
   * existing transactions in the database. IF PDF or Image file, will attempt to extract transactions using AI via
   * Cloud API.
   *
   * @param filePath          The file path to the local file
   * @param mapper            Mapper to map transaction fields from the import file to the ITransaction interface
   * @returns                 An array of reconciled transactions from the import file
   */
  @Command(AppCommandIds.IMPORT_FILE)
  public async readTransactionsFile({
    filePath,
    mapper,
  }: AppCommandRequest<AppCommandIds.IMPORT_FILE>): AppCommandResponse<AppCommandIds.IMPORT_FILE> {
    let transactionData: ImportTransaction[] = []
    logger.info(`Reading Transactions File: ${filePath} with mapper:`, mapper)
    // Determine File Type
    const ext = this._getFileExtension(filePath)

    // Switch between file types
    switch (ext) {
      case 'ofx':
      case 'qfx':
        try {
          const ofx = new OfxParser()
          const fileData = fs.readFileSync(filePath).toString('utf-8')
          const parsedData = await ofx.parse(fileData)
          transactionData = parsedData.transactions
        } catch (error) {
          logger.error(`Error parsing ${filePath}:`, error)
          throw new Error(`Error parsing ${filePath}`)
        }
        break
      case 'qif':
        try {
          const qif = new QifParser()
          const fileData = fs.readFileSync(filePath, 'utf8')
          const parsedData = await qif.parse(fileData)
          transactionData = parsedData.transactions
        } catch (error) {
          logger.error(`Error parsing ${filePath}:`, error)
          throw new Error(`Error parsing ${filePath}: ${error}`)
        }
        break
      case 'csv':
        if (!mapper.csvMapper) {
          logger.warn('CSV Mapper Required for CSV Files')
          throw new Error('CSV Mapper Required for CSV Files')
        }
        try {
          const csv = new CSVParser()
          const fileData = fs.readFileSync(filePath, 'utf8')
          const parsedData = await csv.parse(fileData, mapper.csvMapper)
          transactionData = parsedData.transactions
        } catch (error) {
          logger.error(`Error parsing ${filePath}:`, error)
          throw new Error(`Error parsing ${filePath}: ${error}`)
        }
        break
      case 'pdf':
      case 'jpg':
      case 'png':
      case 'heic':
        try {
          const fileBuffer = fs.readFileSync(filePath)
          const arrayFileBuffer = fileBuffer.buffer.slice(
            fileBuffer.byteOffset,
            fileBuffer.byteOffset + fileBuffer.byteLength,
          ) as ArrayBuffer
          const extractedTransactions = await CommandsClient.executeAppCommand(
            AppCommandIds.AI_EXTRACT_TRANSACTIONS,
            {
              file: arrayFileBuffer,
              fileName: filePath.split('/').slice(-1)[0],
              fileType: 'application/pdf',
            },
          )
          transactionData = extractedTransactions.map((t) => ({
            date: t.date,
            name: t.name,
            amount: t.amount,
            memo: t.memo,
            pending: false,
          }))
        } catch (error) {
          logger.error(`Error extracting transactions from ${filePath}:`, error)
          throw new Error(`Error extracting transactions from ${filePath}: ${error}`)
        }
        break
      default:
        logger.warn(`File Extension '${ext}' Not Supported.`)
        throw new Error(`File Extension '${ext}' Not Supported.`)
    }

    // Lookup Accounts in Database to map transactions to
    const parsedImportAccounts =
      mapper.accountsMapper && Object.keys(mapper.accountsMapper).length > 0
        ? mapper.accountsMapper
        : { default: mapper.defaultAccountId }
    const importAccounts: Record<string, IAccount> = {}
    for (const [key, value] of Object.entries(parsedImportAccounts)) {
      const account = await CommandsClient.executeAppCommand(AppCommandIds.GET_ACCOUNT, {
        id: value,
      })
      if (!account || account.class !== 'ACCOUNT') {
        logger.warn(`Bank Account ${value} Not Found`)
        throw new Error(`Bank Account ${value} Not Found`)
      }
      importAccounts[key] = account
    }

    // Map parsed Transaction data to ITransaction Type
    const importTransactions = transactionData.map((t) => {
      const account = importAccounts[t.account_id as string] || importAccounts['default']

      const transaction = createNewTransaction({
        account_id: account.id,
        date: t.date,
        title: t.name,
        amount: t.amount,
        import_id: t.id,
        pending: t.pending || false,
        currency_code: account.acc_iso_currency as string,
        note: t.memo,
        category_id:
          t.lineItems &&
          t.lineItems.length === 1 &&
          mapper.categoriesMapper &&
          Object.prototype.hasOwnProperty.call(mapper.categoriesMapper, t.lineItems[0].category)
            ? mapper.categoriesMapper[t.lineItems[0].category]
            : undefined,
      })

      // Split Transaction if it has multiple line items
      if (t.lineItems && t.lineItems.length > 1) {
        const splitTransactions: ILineItemUpdate[] = t.lineItems.map((lineItem) => {
          return {
            amount: lineItem.amount,
            account_id:
              mapper.categoriesMapper &&
              Object.prototype.hasOwnProperty.call(mapper.categoriesMapper, lineItem.category)
                ? mapper.categoriesMapper[lineItem.category]
                : undefined,
            note: lineItem.memo,
          }
        })
        return updateTransaction(transaction, { splits: splitTransactions })
      }

      return transaction
    })

    logger.info(
      `Read ${importTransactions.length} Transactions across ${
        importAccounts.length ?? 1
      } Accounts`,
    )

    // Reconcile Import File Transactions
    const reconciledTransactions: ReconciledTransaction[] = []
    for (const [_key, value] of Object.entries(importAccounts)) {
      const existingTransactions = await CommandsClient.executeAppCommand(
        AppCommandIds.LIST_TRANSACTIONS,
        { account_ids: { include: [value.id] } },
      )
      // Filter Transactions by Account
      const accountTransactions = importTransactions.filter((t) => t.account_id === value.id)
      const reconciliationHelper = new ReconciliationHelper(existingTransactions)
      const reconciled = reconciliationHelper.reconcile(accountTransactions as ITransaction[])
      reconciledTransactions.push(...reconciled)
    }
    return reconciledTransactions
  }

  /**
   * Parse the file to get any mappings that are required to map the file data correctly
   * to the ITransaction interface. (i,e, for CSV files)
   *
   * @param filePath  The file path to the local File
   * @param delimiter The delimiter used in the CSV file (@default ',')
   * @returns         ParsedFileMappings
   */
  @Command(AppCommandIds.IMPORT_MAPPINGS)
  public async readFileMappings({
    filePath,
    delimiter = ',',
  }: AppCommandRequest<AppCommandIds.IMPORT_MAPPINGS>): AppCommandResponse<AppCommandIds.IMPORT_MAPPINGS> {
    // Determine File Type
    const ext = this._getFileExtension(filePath)

    // Switch between file types
    switch (ext) {
      case 'ofx':
      case 'qfx':
        try {
          const ofx = new OfxParser()
          const fileData = fs.readFileSync(filePath).toString('utf-8')
          const parsedData = await ofx.parse(fileData)
          const categories = this._getDistinctCategories(parsedData.transactions)
          const accounts = this._getDistinctAccounts(parsedData.transactions, parsedData.accounts)
          return { fileType: ext, categories, accounts }
        } catch (error) {
          logger.error(`Error parsing ${filePath}:`, error)
          throw new Error(`Error parsing ${filePath}`)
        }
      case 'qif':
        try {
          const qif = new QifParser()
          const fileData = fs.readFileSync(filePath, 'utf8')
          const parsedData = await qif.parse(fileData)
          const categories = this._getDistinctCategories(parsedData.transactions)
          const accounts = this._getDistinctAccounts(parsedData.transactions, parsedData.accounts)
          return { fileType: 'qif', categories, accounts }
        } catch (error) {
          logger.error(`Error parsing ${filePath}:`, error)
          throw new Error(`Error parsing ${filePath}: ${error}`)
        }
      case 'csv':
        try {
          const csv = new CSVParser()
          const fileData = fs.readFileSync(filePath, 'utf8')
          const csvHeaders = csv.getHeaders(fileData, delimiter)
          return { fileType: 'csv', csvHeaders }
        } catch (error) {
          logger.error(`Error parsing CSV Headers for ${filePath}:`, error)
          throw new Error(`Error parsing parsing CSV Headers for ${filePath}`)
        }
      case 'pdf':
      case 'jpg':
      case 'png':
      case 'heic':
        return { fileType: ext }
      default:
        logger.warn(`File Extension '${ext}' Not Supported.`)
        throw new Error(`File Extension '${ext}' Not Supported.`)
    }
  }

  /**
   * Once the transactions have been reconciled and reviewed by the user, complete the import
   * by committing the transactions to the database.
   *
   * @param reconciledTransactions  An array of ReconciledTransactions to import into database
   */
  @Command(AppCommandIds.IMPORT_TRANSACTIONS)
  public async importTransactions({
    reconciledTransactions,
  }: AppCommandRequest<AppCommandIds.IMPORT_TRANSACTIONS>): AppCommandResponse<AppCommandIds.IMPORT_TRANSACTIONS> {
    const importTransactions = reconciledTransactions.filter((t) => t.import)
    logger.info(`Importing ${importTransactions.length} Transactions`)
    const savedTransactions = await CommandsClient.executeAppCommand(
      AppCommandIds.SAVE_TRANSACTIONS,
      importTransactions.map((t) => {
        const { reconciliation: _reconciliation, import: _import, ...transaction } = t
        return TransactionEntity.getClassInstance(transaction)
      }),
    )
    logger.info(`Imported ${savedTransactions.length} Transactions`)
    return savedTransactions
  }

  /**
   * Helper function to get the file extension from a file path
   *
   * @param filePath  The full file path
   * @returns         The file extension
   */
  private _getFileExtension(filePath: string): string {
    return filePath.split('.').slice(-1)[0].toLowerCase()
  }

  /**
   * If the import file Transactions include Accounts, get the distinct Accounts
   * from the import file so they can be mapped to existing Accounts in the database
   * using the ParsedFileMappings
   *
   * @param transactions  The parsed Transaction data from the import file
   * @returns             An array of distinct Accounts that are used in the transactions
   */
  private _getDistinctAccounts(
    transactions: ImportTransaction[],
    accounts?: ImportAccount[],
  ): ParsedAccount[] {
    // Loop through transactions and get distinct accounts
    const transactionAccounts = transactions
      .reduce((acc: string[], t) => {
        if (t.account_id && !acc.includes(t.account_id)) {
          acc.push(t.account_id)
        }
        return acc
      }, [])
      .sort()
    return transactionAccounts.map((ta) => {
      if (accounts && accounts.length > 0) {
        const account = accounts.find((a) => a.id === ta)
        return { id: account?.id as string, name: account?.name as string }
      }

      return { id: ta, name: ta }
    })
  }

  /**
   * If the import file Transactions include Categories, get the distinct Categories
   * from the import file so they can be mapped to existing Categories in the database
   * using the ParsedFileMappings
   *
   * @param transactions  The parsed Transaction data from the import file
   * @returns             An array of distinct Categories that are used in the transactions
   */
  private _getDistinctCategories(transactions: ImportTransaction[]): string[] {
    // Loop through transactions and get distinct categories
    return transactions
      .reduce((acc: string[], t) => {
        if (t.lineItems) {
          for (const lineItem of t.lineItems) {
            if (lineItem.category && !acc.includes(lineItem.category)) {
              acc.push(lineItem.category)
            }
          }
        }
        return acc
      }, [])
      .sort()
  }
}

// Export instance of Class
export const ImportService = new ImportServiceClass()
