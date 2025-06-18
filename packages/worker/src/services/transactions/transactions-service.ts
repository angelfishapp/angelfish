import { validate } from 'class-validator'
import { Brackets, In } from 'typeorm'

import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import {
  AppCommandIds,
  Command,
  UNCLASSIFIED_EXPENSES_ID,
  UNCLASSIFIED_INCOME_ID,
  allCategoryTypes,
} from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { LineItemEntity, TransactionEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('TransactionService')

/**
 * Provide data access layer for managing and querying transactions. When editing transactions
 * it will have a direct impact on the line_items table so they need to be kept in sync to ensure
 * double entry accounting rules are followed
 */
class TransactionServiceClass {
  /**
   * List all Transactions for a particular Bank Account
   *
   * TODO: Add support for account_owner to filter transactions by owner, currently ignored
   *
   * @param query    A TransactionQuery object to query a list of Transactions
   */
  @Command(AppCommandIds.LIST_TRANSACTIONS)
  public async listTransactions({
    account_ids,
    account_owner,
    category_ids,
    category_types,
    category_group_ids,
    category_group_types,
    currency_code,
    start_date,
    end_date,
    tag_ids,
    requires_sync,
  }: AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>): AppCommandResponse<AppCommandIds.LIST_TRANSACTIONS> {
    logger.debug('List Transactions Query', {
      account_ids,
      account_owner,
      category_ids,
      category_types,
      category_group_ids,
      category_group_types,
      currency_code,
      start_date,
      end_date,
      tag_ids,
      requires_sync,
    })

    // If query is empty, return empty array
    if (
      !account_ids &&
      !account_owner &&
      !category_ids &&
      !category_types &&
      !category_group_ids &&
      !category_group_types &&
      !currency_code &&
      !start_date &&
      !end_date &&
      !tag_ids &&
      requires_sync === undefined
    ) {
      return []
    }

    // Build initial query
    const query = DatabaseManager.getConnection()
      .getRepository(TransactionEntity)
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.line_items', 'line_items')
      .leftJoinAndSelect('line_items.tags', 'tags')
      .leftJoin('line_items.account', 'account')
      .orderBy('transaction.date', 'ASC')

    // Filter on Bank Account IDs
    if (account_ids) {
      if (account_ids.include?.length) {
        query.andWhere('transaction.account_id IN (:...include_account_ids)', {
          include_account_ids: account_ids.include,
        })
      }
      if (account_ids.exclude?.length) {
        query.andWhere('transaction.account_id NOT IN (:...exclude_account_ids)', {
          exclude_account_ids: account_ids.exclude,
        })
      }
    }

    // If start_date/end_date is specified, only return transactions within that range
    // If no end_date is specified, default to today
    // If no start_date is specified, default to 1900-01-01
    if (start_date || end_date) {
      query.andWhere('transaction.date BETWEEN :start AND :end', {
        start: start_date ?? '1900-01-01',
        end: end_date ?? new Date().toISOString().split('T')[0],
      })
    }

    // Filter on ISO currency code
    if (currency_code) {
      query.andWhere('transaction.currency_code = :currency_code', {
        currency_code: currency_code.toUpperCase(),
      })
    }

    // Filter on Category Group Types by adding to the category_types filter, this saves adding a Join to query impacting performance
    if (category_group_types) {
      if (category_group_types.include?.length) {
        const validCategoryTypes = allCategoryTypes
          .filter((catType) => category_group_types.include?.includes(catType.groupType))
          .map((catType) => catType.type)

        if (category_types?.include) {
          category_types.include = Array.from(
            new Set([...category_types.include, ...validCategoryTypes]),
          )
        } else {
          category_types = { include: validCategoryTypes }
        }
      }
      if (category_group_types.exclude?.length) {
        const validCategoryTypes = allCategoryTypes
          .filter((catType) => category_group_types.exclude?.includes(catType.groupType))
          .map((catType) => catType.type)

        if (category_types?.exclude) {
          category_types.exclude = Array.from(
            new Set([...category_types.exclude, ...validCategoryTypes]),
          )
        } else {
          category_types = { exclude: validCategoryTypes }
        }
      }
    }

    // Filter on Category Types
    if (category_types) {
      if (category_types.include?.length) {
        query.andWhere('account.cat_type IN (:...include_category_types)', {
          include_category_types: category_types.include,
        })
      }
      if (category_types.exclude?.length) {
        query.andWhere('account.cat_type NOT IN (:...exclude_category_types)', {
          exclude_category_types: category_types.exclude,
        })
      }
    }

    // Convert category_group_ids to category_ids if category_group_ids includes
    // UNCLASSIFIED_EXPENSES_ID or UNCLASSIFIED_INCOME_ID
    if (category_group_ids) {
      const idsToPromote = [UNCLASSIFIED_EXPENSES_ID, UNCLASSIFIED_INCOME_ID]

      // Promote includes
      const promotedIncludes =
        category_group_ids.include?.filter((id) => idsToPromote.includes(id)) ?? []
      if (promotedIncludes.length > 0) {
        category_ids = category_ids ?? {}
        category_ids.include = Array.from(
          new Set([...(category_ids.include ?? []), ...promotedIncludes]),
        )

        // Remove promoted IDs from category_group_ids.include
        category_group_ids.include = category_group_ids.include?.filter(
          (id) => !idsToPromote.includes(id),
        )
      }

      // Promote excludes
      const promotedExcludes =
        category_group_ids.exclude?.filter((id) => idsToPromote.includes(id)) ?? []
      if (promotedExcludes.length > 0) {
        category_ids = category_ids ?? {}
        category_ids.exclude = Array.from(
          new Set([...(category_ids.exclude ?? []), ...promotedExcludes]),
        )

        // Remove promoted IDs from category_group_ids.exclude
        category_group_ids.exclude = category_group_ids.exclude?.filter(
          (id) => !idsToPromote.includes(id),
        )
      }
    }

    // If category_ids is specified, filter on that
    if (category_ids?.include?.length || category_ids?.exclude?.length) {
      const includeConditions: string[] = []
      const excludeConditions: string[] = []
      const parameters: Record<string, any> = {}

      // --- Include filters ---
      if (category_ids.include?.length) {
        const normalIds = category_ids.include.filter(
          (id) => id !== UNCLASSIFIED_EXPENSES_ID && id !== UNCLASSIFIED_INCOME_ID,
        )

        if (normalIds.length > 0) {
          includeConditions.push('li.account_id IN (:...includeCatIds)')
          parameters.includeCatIds = normalIds
        }

        if (category_ids.include.includes(UNCLASSIFIED_EXPENSES_ID)) {
          includeConditions.push('li.account_id IS NULL AND li.amount < 0')
        }

        if (category_ids.include.includes(UNCLASSIFIED_INCOME_ID)) {
          includeConditions.push('li.account_id IS NULL AND li.amount > 0')
        }

        const includeSubQuery = query
          .subQuery()
          .select('1')
          .from('line_items', 'li')
          .where('li.transaction_id = transaction.id')
          .andWhere(`(${includeConditions.join(' OR ')})`)
          .getQuery()

        query.andWhere(`EXISTS ${includeSubQuery}`, parameters)
      }

      // --- Exclude filters ---
      if (category_ids.exclude?.length) {
        const normalIds = category_ids.exclude.filter(
          (id) => id !== UNCLASSIFIED_EXPENSES_ID && id !== UNCLASSIFIED_INCOME_ID,
        )

        if (normalIds.length > 0) {
          excludeConditions.push('li.account_id IN (:...excludeCatIds)')
          parameters.excludeCatIds = normalIds
        }

        if (category_ids.exclude.includes(UNCLASSIFIED_EXPENSES_ID)) {
          excludeConditions.push('li.account_id IS NULL AND li.amount < 0')
        }

        if (category_ids.exclude.includes(UNCLASSIFIED_INCOME_ID)) {
          excludeConditions.push('li.account_id IS NULL AND li.amount > 0')
        }

        const excludeSubQuery = query
          .subQuery()
          .select('1')
          .from('line_items', 'li')
          .where('li.transaction_id = transaction.id')
          .andWhere(`(${excludeConditions.join(' OR ')})`)
          .getQuery()

        query.andWhere(`NOT EXISTS ${excludeSubQuery}`, parameters)
      }
    }

    // If category_group_ids is specified, filter on that
    if (category_group_ids) {
      if (category_group_ids.include?.length) {
        const includeSubquery = query
          .subQuery()
          .select('1')
          .from('line_items', 'li')
          .innerJoin('accounts', 'a', 'a.id = li.account_id')
          .where('li.transaction_id = transaction.id')
          .andWhere('a.cat_group_id IN (:...catGroupInclude)')
          .getQuery()

        query.andWhere(
          new Brackets((qb) => {
            qb.andWhere(`EXISTS ${includeSubquery}`, {
              catGroupInclude: category_group_ids.include,
            })
          }),
        )
      }

      if (category_group_ids.exclude?.length) {
        const excludeSubquery = query
          .subQuery()
          .select('1')
          .from('line_items', 'li')
          .innerJoin('accounts', 'a', 'a.id = li.account_id')
          .where('li.transaction_id = transaction.id')
          .andWhere('a.cat_group_id IN (:...catGroupExclude)')
          .getQuery()

        query.andWhere(
          new Brackets((qb) => {
            qb.andWhere(`NOT EXISTS ${excludeSubquery}`, {
              catGroupExclude: category_group_ids.exclude,
            })
          }),
        )
      }
    }

    // Filter on Tags, will return only Transactions that have at least one
    // line item with a tag that matches the include/exclude criteria
    if (tag_ids) {
      if (tag_ids.include?.length) {
        const includeSubquery = query
          .subQuery()
          .select('1')
          .from('line_items_tags', 'lt')
          .innerJoin('line_items', 'li', 'li.id = lt.line_item_id')
          .where('lt.tag_id IN (:...tagsInclude)')
          .andWhere('li.transaction_id = transaction.id')
          .getQuery()

        query.andWhere(
          new Brackets((qb) => {
            qb.andWhere(`EXISTS ${includeSubquery}`, {
              tagsInclude: tag_ids.include,
            })
          }),
        )
      }

      if (tag_ids.exclude?.length) {
        const excludeSubquery = query
          .subQuery()
          .select('1')
          .from('line_items_tags', 'lt')
          .innerJoin('line_items', 'li', 'li.id = lt.line_item_id')
          .where('lt.tag_id IN (:...tagsExclude)')
          .andWhere('li.transaction_id = transaction.id')
          .getQuery()

        query.andWhere(
          new Brackets((qb) => {
            qb.andWhere(`NOT EXISTS ${excludeSubquery}`, {
              tagsExclude: tag_ids.exclude,
            })
          }),
        )
      }
    }

    // Filter on Tranactions that have requires_sync set to true
    if (requires_sync) {
      query.andWhere('transaction.requires_sync = :requires_sync', { requires_sync })
    }

    logger.silly('Query:', query.getSql())

    const results = await query.getMany()
    logger.debug(`Found ${results.length} Transactions`)
    logger.silly('Results:', results)
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
    logger.silly('Saving Transactions:', sanitizedTransactions)
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
      // Create a new unclassified line item
      const unclassifiedLineItem = new LineItemEntity()
      unclassifiedLineItem.amount = transaction.amount
      unclassifiedLineItem.local_amount = transaction.amount
      transaction.line_items = [unclassifiedLineItem]
      // Set transaction to requires_sync = true to ensure local_amounts are correctly set
      // during next sync
      transaction.requires_sync = true
    }

    // Make sure local_amount is set to amount if undefined
    for (let i = 0; i < transaction.line_items.length; i++) {
      if (transaction.line_items[i].local_amount === undefined) {
        logger.debug(
          `LineItem ${transaction.line_items[i].id} for Transaction ${transaction.id} has undefined local_amount`,
        )
        // Update line item local_amount to match amount
        transaction.line_items[i].local_amount = transaction.line_items[i].amount
        // Set transaction to requires_sync = true to ensure local_amounts are correctly set
        // during next sync
        transaction.requires_sync = true
      }
    }

    // Manually update modified_on date to now as this will not automatically be set
    // if only update line_items properties
    transaction.modified_on = new Date()

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
