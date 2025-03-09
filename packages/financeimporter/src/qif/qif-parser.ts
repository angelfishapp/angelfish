import type { Account } from '../types/account'
import type { Category } from '../types/category'
import type { LineItem } from '../types/line-item'
import type { ParsedData, Parser } from '../types/parser'
import type { Transaction } from '../types/transaction'
import { parseDate } from '../utils'
import type { QifAccount, QifCategory, QifData, QifSplit, QifTransaction } from './qif-parser-types'
import { QifParserError, QifType } from './qif-parser-types'
import { isDDMMYYFormat } from './qif-parser-utils'

/**
 * Class to parse QIF files. Tries to provide a one-to-one mapping of the physical model into a typed object
 * Uses the specification [here](https://web.archive.org/web/20100222214101/http://web.intuit.com/support/quicken/docs/d_qif.html) as a source of truth.
 * Original source code taken from [qif-ts](https://gitlab.com/cluskii/qif-ts/) module.
 */
export class QifParser implements Parser {
  /**
   * Read the contents of a Qif file and parse it into a QifData object. If the file contains
   * multiple sections (e.g. multiple accounts), each section will be parsed into a separate QifData object.
   *
   * @param fileData  The Qif file data as string to parse
   * @returns         A promise that resolves to a ParsedData object
   */
  public async parse(fileData: string): Promise<ParsedData> {
    // Initialise the ParsedData object
    const parsedData: ParsedData = {
      accounts: [],
      categories: [],
      transactions: [],
    }

    // Current Account - if an account is defined above a list of transactions
    // assume that the transactions belong to that account
    let currentAccountId: string | undefined = undefined

    // Only parse supported !Type sections, ignore the rest
    const patterns = Object.values(QifType)
    const regex = new RegExp(
      `(?=${patterns.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'g',
    )
    const qifSections = fileData.split(regex).filter(Boolean)
    await Promise.all(
      qifSections.map(async (section) => {
        if (
          section.startsWith(QifType.Investment) ||
          section.startsWith(QifType.Bank) ||
          section.startsWith(QifType.Cash) ||
          section.startsWith(QifType.Card) ||
          section.startsWith(QifType.Asset) ||
          section.startsWith(QifType.Liability) ||
          section.startsWith(QifType.Category) ||
          section.startsWith(QifType.Class) ||
          section.startsWith(QifType.Account)
        ) {
          const qifData = this.parseQifSection(section)

          // Add the parsed data to the ParsedData object
          switch (qifData.type) {
            case QifType.Account: {
              // Add accounts to the ParsedData object
              const qifAccounts = qifData.accounts
              if (qifAccounts) {
                let count = 1
                qifAccounts.forEach((account) => {
                  // Check if the account has been parsed already using the account name
                  const index = parsedData.accounts.findIndex((a) => a.name === account.name)
                  if (index === -1) {
                    // New account to add to the ParsedData object
                    const parsedAccount: Account = {
                      id: `${count++}`,
                      name: account.name,
                    }
                    if (account.balance !== undefined) {
                      parsedAccount.balances = {
                        current: account.balance,
                      }
                    }
                    parsedData.accounts.push(parsedAccount)

                    // Set the current account ID to add transactions to
                    currentAccountId = parsedAccount.id
                  } else {
                    // Set the current account ID to add transactions to
                    currentAccountId = parsedData.accounts[index].id
                  }
                })
              }
              break
            }
            case QifType.Bank:
            case QifType.Cash:
            case QifType.Card:
            case QifType.Asset:
            case QifType.Liability: {
              // Add transactions to the ParsedData object
              const qifTransactions = qifData.transactions
              if (qifTransactions) {
                const isDDMMYY = isDDMMYYFormat(qifTransactions)
                qifTransactions.forEach((transaction) => {
                  // TODO: Handel splits
                  const parsedTransaction: Transaction = {
                    date: parseDate(transaction.date, isDDMMYY),
                    amount: transaction.amount,
                    name: transaction.payee,
                    pending:
                      'clearedStatus' in transaction &&
                      transaction.clearedStatus &&
                      transaction.clearedStatus === ''
                        ? true
                        : false,
                  }
                  if (currentAccountId) {
                    parsedTransaction.account_id = currentAccountId
                  }
                  if (transaction.memo) {
                    parsedTransaction.memo = transaction.memo
                  }
                  if (transaction.reference) {
                    parsedTransaction.check_number = transaction.reference
                  }
                  if (transaction.category || !transaction.splits) {
                    // If the transaction has a category and no splits, add it as a line item
                    parsedTransaction.lineItems = [
                      {
                        category: transaction.category,
                        amount: transaction.amount,
                      } as LineItem,
                    ]
                  }
                  if (transaction.splits) {
                    // If the transaction has splits, add them as line items
                    parsedTransaction.lineItems = transaction.splits.map((split) => {
                      const lineItem: LineItem = {
                        category: split.category,
                        amount: split.amount,
                      }
                      if (split.memo) {
                        lineItem.memo = split.memo
                      }
                      return lineItem
                    })
                  }

                  parsedData.transactions.push(parsedTransaction)
                })
              }
              break
            }
            case QifType.Investment:
              // TODO: Skip investments for now
              break
            case QifType.Category:
            case QifType.Class: {
              // Add categories to the ParsedData object
              const qifCategories = qifData.categories
              if (qifCategories) {
                let count = 1
                qifCategories.forEach((category) => {
                  const parsedCategory: Category = {
                    id: count++,
                    name: category.name,
                  }
                  if (category.type) {
                    parsedCategory.type = category.type
                  }
                  if (category.description) {
                    parsedCategory.description = category.description
                  }
                  parsedData.categories.push(parsedCategory)
                })
              }
              break
            }
          }
        }
      }),
    )

    return parsedData
  }

  /**
   * Deserializes a valid QIF formatted string section.
   *
   * @param data    The string to be deserialized
   * @returns       A QifData object describing the data in the input
   *
   */
  public parseQifSection(data: string) {
    const dataLines: string[] = data
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '')

    if (dataLines.length === 0) {
      throw new QifParserError('No valid QIF content found.')
    }

    const type: QifType = dataLines[0] as QifType

    dataLines.shift()

    switch (type) {
      case QifType.Investment:
        return this.parseInvestmentTrasnactions(dataLines)
      case QifType.Account:
        return this.parseAccounts(dataLines)
      case QifType.Category:
      case QifType.Class:
        return this.parseCategories(dataLines, type)
      case QifType.Bank:
      case QifType.Cash:
      case QifType.Card:
      case QifType.Liability:
      case QifType.Asset:
        return this.parseNonInvestmentTrasnactions(dataLines, type)
      default:
        throw new QifParserError('Qif File Type not supported: ' + type)
    }
  }

  /**
   * Parses Qif Transactions for NonInvestment Accounts
   *
   * @param dataLines   The lines of the Qif file to parse
   * @param type        The type of account, only non investment accounts are supported
   * @returns           A QifData object with parsed transactions
   */
  private parseNonInvestmentTrasnactions(
    dataLines: string[],
    type:
      | QifType.Bank
      | QifType.Cash
      | QifType.Card
      | QifType.Investment
      | QifType.Asset
      | QifType.Liability,
  ) {
    const qifData: QifData = {
      type,
      transactions: [],
    }

    let transaction: QifTransaction = {}
    let currentSplit: QifSplit = {}

    for (const line of dataLines) {
      const lineText = line.substring(1)

      switch (line[0]) {
        case 'D':
          // Date
          transaction.date = lineText
          break
        case 'T':
          // Amount
          transaction.amount = parseFloat(lineText.replace(/,/g, '')) // Remove commas
          break
        case 'C':
          // Cleared Status. C with nothing after it or missing is uncleared, C* is cleared and CX is reconciled.
          transaction.clearedStatus = lineText
          break
        case 'N':
          // Num (check or reference number)
          transaction.reference = lineText
          break
        case 'P':
          // Payee
          transaction.payee = lineText
          break
        case 'M':
          // Memo
          transaction.memo = lineText
          break
        case 'A':
          // Address
          transaction.address = transaction.address || []
          transaction.address.push(lineText)
          break
        case 'L':
          // Transaction Category
          transaction.category = lineText
          break
        case 'S':
          // Split Category
          if (Object.keys(currentSplit).length > 0 && currentSplit.category) {
            if (!transaction.splits) {
              transaction.splits = []
            }
            transaction.splits.push(currentSplit)
            currentSplit = {}
          }
          currentSplit.category = lineText
          break
        case 'E':
          // Split Memo
          if (Object.keys(currentSplit).length > 0 && currentSplit.memo) {
            if (!transaction.splits) {
              transaction.splits = []
            }
            transaction.splits.push(currentSplit)
            currentSplit = {}
          }
          currentSplit.memo = lineText
          break
        case '$':
          // Split Amount
          if (Object.keys(currentSplit).length > 0 && currentSplit.amount) {
            if (!transaction.splits) {
              transaction.splits = []
            }
            transaction.splits.push(currentSplit)
            currentSplit = {}
          }
          currentSplit.amount = parseFloat(lineText.replace(/,/g, '')) // Remove commas
          break
        case '%':
          // Split Percentage
          if (Object.keys(currentSplit).length > 0 && currentSplit.percent) {
            if (!transaction.splits) {
              transaction.splits = []
            }
            transaction.splits.push(currentSplit)
            currentSplit = {}
          }
          currentSplit.percent = parseFloat(lineText)
          break
        case '^':
          if (Object.keys(currentSplit).length > 0) {
            if (!transaction.splits) {
              transaction.splits = []
            }
            transaction.splits.push(currentSplit)
            currentSplit = {}
          }
          if (Object.keys(transaction).length > 0) {
            qifData.transactions.push(transaction)
            transaction = {}
          }
          break
        default:
          throw new QifParserError('Did not recognise detail item for line: ' + line)
      }
    }

    return qifData
  }

  /**
   * Parses investment account transactions in Qif file
   *
   * @param dataLines The lines of the Qif file to parse
   * @returns         A QifData object with parsed transactions
   */
  private parseInvestmentTrasnactions(dataLines: string[]): QifData {
    const qifData: QifData = {
      type: QifType.Investment,
      transactions: [],
    }

    let transaction: QifTransaction = {}
    for (const line of dataLines) {
      const lineText = line.substring(1)

      switch (line[0]) {
        case 'D':
          transaction.date = lineText
          break
        case 'N':
          transaction.investmentAction = lineText
          break
        case 'Y':
          transaction.investmentSecurity = lineText
          break
        case 'I':
          transaction.investmentPrice = parseFloat(lineText)
          break
        case 'Q':
          transaction.investmentQuantity = parseFloat(lineText)
          break
        case 'T':
          transaction.amount = parseFloat(lineText)
          break
        case 'C':
          transaction.clearedStatus = lineText
          break
        case 'P':
          transaction.investmentReminder = lineText
          break
        case 'M':
          transaction.memo = lineText
          break
        case 'O':
          transaction.investmentComission = parseFloat(lineText)
          break
        case 'L':
          transaction.investmentAccount = lineText
          break
        case '$':
          transaction.investmentAmountTransferred = parseFloat(lineText)
          break
        case '^':
          if (Object.keys(transaction).length > 0) {
            qifData.transactions.push(transaction)
            transaction = {}
          }
          break
        default:
          throw new QifParserError('Did not recognise detail item for line: ' + line)
      }
    }

    return qifData
  }

  /**
   * Parses Qif Accounts
   *
   * @param dataLines
   */
  private parseAccounts(dataLines: string[]): QifData {
    const qifData: QifData = {
      type: QifType.Account,
      accounts: [],
    }

    let account: QifAccount = {}
    for (const line of dataLines) {
      const lineText = line.substring(1)
      switch (line[0]) {
        case 'N':
          account.name = lineText
          break
        case 'D':
          account.description = lineText
          break
        case 'T':
          account.type = lineText
          break
        case '$':
        case 'B':
          account.balance = parseFloat(lineText)
          break
        case '/':
          account.balanceDate = lineText
          break
        case 'L':
          account.creditLimit = parseFloat(lineText)
          break
        case '^':
          if (Object.keys(account).length > 0) {
            qifData.accounts.push(account)
            account = {}
          }
          break
        case '!':
          // Skip
          break
        default:
          throw new QifParserError('Did not recognise detail item for line: ' + line)
      }
    }

    return qifData
  }

  /**
   * Parse Qif Categories
   *
   * @param dataLines   The lines of the Qif file to parse
   * @returns           A QifData object with parsed categories
   */
  parseCategories(dataLines: string[], type: QifType.Category | QifType.Class): QifData {
    const qifData: QifData = {
      type,
      categories: [],
    }

    let category: QifCategory = {}
    for (const line of dataLines) {
      const lineText = line.substring(1)
      switch (line[0]) {
        case 'N':
          category.name = lineText
          break
        case 'D':
          category.description = lineText
          break
        case 'T':
          // Tax related if included, not tax related if omitted
          break
        case 'I':
          category.type = 'income'
          break
        case 'E':
          category.type = 'expense'
          break
        case 'B':
          // Budget amount (only in a Budget Amounts QIF file)
          break
        case 'R':
          // Tax schedule information
          break
        case '^':
          if (Object.keys(category).length > 0) {
            qifData.categories.push(category)
            category = {}
          }
          break
        default:
          throw new QifParserError('Did not recognise detail item for line: ' + line)
      }
    }

    return qifData
  }
}
