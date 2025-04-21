import { validate } from 'class-validator'
import { In } from 'typeorm'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { LineItemEntity, TransactionEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('TransactionService')

/**
 * Special ID to filter for unclassified expenses
 */
export const UNCLASSIFIED_EXPENSES_ID = -1
/**
 * Special ID to filter for unclassified income
 */
export const UNCLASSIFIED_INCOME_ID = -2

/**
 * Provide data access layer for managing and querying transactions. When editing transactions
 * it will have a direct impact on the line_items table so they need to be kept in sync to ensure
 * double entry accounting rules are followed
 */
class TransactionServiceClass {
  /**
   * List all Transactions for a particular Bank Account
   *
   * @param query    A TransactionQuery object to query a list of Transactions
   */
  @Command(AppCommandIds.LIST_TRANSACTIONS)
  public async listTransactions({
    account_id,
    cat_id,
    cat_group_id,
    start_date,
    end_date,
    requires_sync,
  }: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>): AppCommandResponse<AppCommandIds.LIST_TRANSACTIONS> {
    logger.debug('List Transactions Query', {
      account_id,
      cat_id,
      cat_group_id,
      start_date,
      end_date,
      requires_sync,
    })

    // If query is empty, return empty array
    if (!account_id && !cat_id && !cat_group_id && !start_date && !end_date && !requires_sync) {
      return []
    }

    // Build query
    const query = DatabaseManager.getConnection()
      .getRepository(TransactionEntity)
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.line_items', 'line_items')
      .leftJoinAndSelect('line_items.tags', 'tags')
      .leftJoin('line_items.account', 'account')
      .orderBy('transaction.date', 'ASC')

    // If account_id is specified, filter on that
    if (account_id) {
      query.andWhere('transaction.account_id = :account_id', { account_id })
    }

    // If start_date is specified, filter on that
    if (start_date) {
      if (!end_date) {
        end_date = new Date().toISOString().split('T')[0]
      }
      query.andWhere('(transaction.date BETWEEN :start_date AND :end_date)', {
        start_date: `${start_date} 00:00:00`,
        end_date: `${end_date} 23:59:59`,
      })
    }

    // Convert cat_group_id to cat_id if cat_group_id is
    // UNCLASSIFIED_EXPENSES_ID or UNCLASSIFIED_INCOME_ID
    if (cat_group_id && cat_group_id === UNCLASSIFIED_EXPENSES_ID) {
      cat_id = UNCLASSIFIED_EXPENSES_ID
      cat_group_id = undefined
    } else if (cat_group_id && cat_group_id === UNCLASSIFIED_INCOME_ID) {
      cat_id = UNCLASSIFIED_INCOME_ID
      cat_group_id = undefined
    }

    // If cat_id is specified, filter on that
    if (cat_id) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('1')
            .from('line_items', 'li')
            .where('li.transaction_id = transaction.id')

          if (cat_id === UNCLASSIFIED_EXPENSES_ID) {
            subQuery.andWhere('li.account_id IS NULL AND li.amount > 0')
          } else if (cat_id === UNCLASSIFIED_INCOME_ID) {
            subQuery.andWhere('li.account_id IS NULL AND li.amount < 0')
          } else {
            subQuery.andWhere('li.account_id = :cat_id')
          }

          return `EXISTS ${subQuery.getQuery()}`
        },
        { cat_id },
      )
    }

    // If cat_group_id is specified, filter on that
    if (cat_group_id) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('1')
            .from('line_items', 'li')
            .innerJoin('accounts', 'a', 'a.id = li.account_id')
            .where('li.transaction_id = transaction.id')
            .andWhere('a.cat_group_id = :cat_group_id')

          return `EXISTS ${subQuery.getQuery()}`
        },
        { cat_group_id },
      )
    }

    // If requires_sync is specified, filter on that
    if (requires_sync) {
      query.andWhere('transaction.requires_sync = :requires_sync', { requires_sync })
    }

    logger.silly('Query:', query.getSql())

    const results = await query.getMany()
    logger.debug(`Found ${results.length} Transactions`)
    logger.debug('Results:', results)
    return results
  }

  /**
   * Get the date range of all transactions in the database
   *
   * @returns       A date range object with start and end dates
   *                If no transactions are found, start and end dates will be null
   */
  @Command(AppCommandIds.GET_TRANSACTIONS_DATE_RANGE)
  public async getTransactionsDateRange(
    _r: AppCommandRequest<AppCommandIds.GET_TRANSACTIONS_DATE_RANGE>,
  ): AppCommandResponse<AppCommandIds.GET_TRANSACTIONS_DATE_RANGE> {
    const dateRange = await DatabaseManager.getConnection()
      .createQueryBuilder(TransactionEntity, 'transaction')
      .select('MIN(transaction.date)', 'start')
      .addSelect('MAX(transaction.date)', 'end')
      .getRawOne()
    // If no transactions found, return null
    if (!dateRange) {
      return {
        start_date: null,
        end_date: null,
      }
    }
    // Return results
    return {
      start_date: dateRange.start as string,
      end_date: dateRange.end as string,
    }
  }

  /**
   * Get a Transaction via ID
   *
   * @param id    The Transaction ID to fetch
   * @returns     The Transaction if found, or null if not
   */
  @Command(AppCommandIds.GET_TRANSACTION)
  public async getTransaction({
    id,
  }: AppCommandRequest<AppCommandIds.GET_TRANSACTION>): AppCommandResponse<AppCommandIds.GET_TRANSACTION> {
    const transactionRepo = DatabaseManager.getConnection().getRepository(TransactionEntity)
    return await transactionRepo.findOne({ where: { id } })
  }

  /**
   * Save an array of Transactions to the database.
   *
   * @param transactions  An array of Transactions
   */
  @Command(AppCommandIds.SAVE_TRANSACTIONS)
  public async saveTransactions(
    transactions: AppCommandRequest<AppCommandIds.SAVE_TRANSACTIONS>,
  ): AppCommandResponse<AppCommandIds.SAVE_TRANSACTIONS> {
    // Sanitize and validate all transactions
    const sanitizedTransactions: TransactionEntity[] = []
    for (const t of transactions) {
      const transaction = TransactionEntity.getClassInstance(t)
      sanitizedTransactions.push(await this._sanitizeAndValidate(transaction))
    }

    // No errors, insert array
    const transactionRepo = DatabaseManager.getConnection().getRepository(TransactionEntity)
    const savedTransactions = await transactionRepo.save(sanitizedTransactions)

    // Reload transactions with line_item relations
    const savedIds = savedTransactions.map((t) => t.id)
    return await transactionRepo.find({
      where: { id: In(savedIds) },
    })
  }

  /**
   * Delete a transaction and all its associated line items from the database
   *
   * @param id    The Transaction ID to delete
   */
  @Command(AppCommandIds.DELETE_TRANSACTION)
  public async deleteTransaction({
    id,
  }: AppCommandRequest<AppCommandIds.DELETE_TRANSACTION>): AppCommandResponse<AppCommandIds.DELETE_TRANSACTION> {
    const transactionRepo = DatabaseManager.getConnection().getRepository(TransactionEntity)
    await transactionRepo.delete(id)
  }

  /**
   * Sanitize and Validate Transaction fields to ensure Transaction is correctly stored
   *
   * @param transaction   The Transaction to sanitize
   */
  private async _sanitizeAndValidate(transaction: TransactionEntity): Promise<TransactionEntity> {
    if (!transaction.id && !transaction.line_items) {
      // Creating new transaction
      // Create 2 line items, 1 for account
      // and 1 unclassified line item
      const accountLineItem = new LineItemEntity()
      accountLineItem.account_id = transaction.account_id
      accountLineItem.amount = transaction.amount
      accountLineItem.local_amount = transaction.amount
      const unclassifiedLineItem = new LineItemEntity()
      unclassifiedLineItem.amount = transaction.amount * -1
      unclassifiedLineItem.local_amount = transaction.amount * -1
      transaction.line_items = [accountLineItem, unclassifiedLineItem]
      // Set transaction to requires_sync = true to ensure local_amounts are correctly set
      transaction.requires_sync = true
    }

    // Validate Transaction
    const errors = await validate(TransactionEntity.getClassInstance(transaction), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      let errorMsg = 'Cannot validate TransactionEntity: unknown class'
      if (transaction instanceof TransactionEntity) {
        errorMsg = 'Cannot save TransactionEntity as it failed validation'
      }
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    return transaction
  }
}

// Export instance of Class
export const TransactionService = new TransactionServiceClass()
