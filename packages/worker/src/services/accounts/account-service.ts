import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse, IAccount } from '@angelfish/core'
import { AppCommandIds, Command, CommandsClient } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { AccountEntity, LineItemEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('AccountService')

/**
 * Manage Accounts in database.
 */
class AccountServiceClass {
  /**
   *  List of all Accounts in the database
   *
   * @returns        A list of all Accounts in the database
   */
  @Command(AppCommandIds.LIST_ACCOUNTS)
  public async listAccounts({
    account_class,
    category_group_id,
    institution_id,
  }: AppCommandRequest<AppCommandIds.LIST_ACCOUNTS>): AppCommandResponse<AppCommandIds.LIST_ACCOUNTS> {
    const query = DatabaseManager.getConnection().createQueryBuilder(AccountEntity, 'account')
    // Gets SUM of current_balance for all transactions associated with account
    const accountBalanceQuery = query
      .subQuery()
      .select('transactions.account_id', 'account_id')
      .addSelect('ROUND(SUM(transactions.amount), 2)', 'total')
      .from('transactions', 'transactions')
      .groupBy('transactions.account_id')
      .getQuery()

    query.addCommonTableExpression(accountBalanceQuery.slice(1, -1), 'account_balances')
    query.addSelect(
      'ROUND(COALESCE(account.acc_start_balance, 0) + COALESCE(ab.total, 0), 2)',
      'account_current_balance',
    )
    query.leftJoin('account_balances', 'ab', 'ab.account_id = account.id')
    query.leftJoinAndSelect('account.acc_owners', 'users')

    // Add Where Clause
    if (account_class) {
      query.where('account.class = :typeClass', { typeClass: account_class })
    } else if (category_group_id) {
      query.where('account.cat_group_id = :categoryGroupID', {
        categoryGroupID: category_group_id,
      })
    } else if (institution_id) {
      query.where('account.acc_institution_id = :institutionID', { institutionID: institution_id })
    }

    // Run query
    query.groupBy('account.id, users.id')
    const accounts = await query.getMany()

    // For accounts of Class 'ACCOUNT', convert current_balance to Book's default currency
    return await this._getLocalBalances(accounts)
  }

  /**
   * List all the distinct currencies for the accounts in the database
   * It will also return the default currency for the book
   *
   * @returns        A list of all distinct currencies for the accounts in the database
   *                and the default currency for the book
   */
  @Command(AppCommandIds.LIST_ACCOUNT_CURRENCIES)
  public async listAccountCurrencies(
    _r: AppCommandRequest<AppCommandIds.LIST_ACCOUNT_CURRENCIES>,
  ): AppCommandResponse<AppCommandIds.LIST_ACCOUNT_CURRENCIES> {
    // Get the default currency for the book
    const default_currency = (
      await CommandsClient.executeAppCommand(AppCommandIds.GET_BOOK)
    ).default_currency.toUpperCase()

    const query = DatabaseManager.getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select('DISTINCT account.acc_iso_currency')
    const foreign_currencies =
      (await query.getRawMany())
        .filter((row: { acc_iso_currency: string }) => {
          if (row.acc_iso_currency === null) {
            return false
          }
          return row.acc_iso_currency.toUpperCase() !== default_currency
        })
        .map((row: { acc_iso_currency: string }) => row.acc_iso_currency.toUpperCase()) ?? []

    logger.debug(`Default currency: ${default_currency}; Foreign currencies: ${foreign_currencies}`)

    return {
      default_currency,
      foreign_currencies,
    }
  }

  /**
   *  Get an Accounts from the database
   *
   * @returns        A list of all Accounts in the database
   */
  @Command(AppCommandIds.GET_ACCOUNT)
  public async getAccount({
    id,
  }: AppCommandRequest<AppCommandIds.GET_ACCOUNT>): AppCommandResponse<AppCommandIds.GET_ACCOUNT> {
    const query = DatabaseManager.getConnection().createQueryBuilder(AccountEntity, 'account')
    // Gets SUM of current_balance for all transactions associated with account
    const accountBalanceQuery = query
      .subQuery()
      .select('transactions.account_id', 'account_id')
      .addSelect('ROUND(SUM(transactions.amount), 2)', 'total')
      .from('transactions', 'transactions')
      .where('transactions.account_id = :id', { id })
      .groupBy('transactions.account_id')
      .getQuery()
    query.addCommonTableExpression(accountBalanceQuery.slice(1, -1), 'account_balances')
    query.addSelect(
      'ROUND(COALESCE(account.acc_start_balance, 0) + COALESCE(ab.total, 0), 2)',
      'account_current_balance',
    )
    query.leftJoin('account_balances', 'ab', 'ab.account_id = account.id')
    query.leftJoinAndSelect('account.acc_owners', 'users')
    query.where('account.id = :id', { id })
    query.groupBy('account.id, users.id')
    const account = await query.getOne()
    if (!account) {
      return null
    }
    return (await this._getLocalBalances([account]))[0]
  }

  /**
   *  Save an Account to the database
   *
   * @returns        A list of all Accounts in the database
   */
  @Command(AppCommandIds.SAVE_ACCOUNT)
  public async saveAccount(
    account: AppCommandRequest<AppCommandIds.SAVE_ACCOUNT>,
  ): AppCommandResponse<AppCommandIds.SAVE_ACCOUNT> {
    const sanitizedAccount = await this._sanitizeAndValidate(account)

    // Get the current currencies in the database before saving
    const currencesBeforeSave = await this.listAccountCurrencies()
    // Save account to database
    const savedAccount = await DatabaseManager.getConnection()
      .getRepository(AccountEntity)
      .save(sanitizedAccount)
    // Check if account has new currency and sync rates for currency if so
    if (
      sanitizedAccount.acc_iso_currency &&
      !currencesBeforeSave.foreign_currencies.includes(sanitizedAccount.acc_iso_currency)
    ) {
      await CommandsClient.executeAppCommand(AppCommandIds.START_SYNC, {
        currencies: true,
      })
    }

    // Have to get account again to populate current_balance field
    return (await this.getAccount({ id: savedAccount.id })) as AccountEntity
  }

  /**
   * Delete an Account from the database. Will do nothing if the Account
   * doesn't exist. If a reassignId is provided, all line_items associated with the
   * account will be reassigned to the new Account, or set to Unclassified if no new
   * account Id provided.
   *
   * @param id            The primary key for the Account to delete
   * @param reassignId    (Optional) The ID of the Account to reassign transactions to
   *                      (@default: null) - will set to Unclassified if no ID provided
   */
  @Command(AppCommandIds.DELETE_ACCOUNT)
  public async deleteAccount({
    id,
    reassignId = null,
  }: AppCommandRequest<AppCommandIds.DELETE_ACCOUNT>): AppCommandResponse<AppCommandIds.DELETE_ACCOUNT> {
    // Get account to check if it exists
    const accountsRepo = DatabaseManager.getConnection().getRepository(AccountEntity)
    const account = await accountsRepo.findOne({ where: { id } })
    if (!account) {
      logger.warn(`Account with id ${id} not found`)
      throw Error(`Account with id ${id} not found`)
    }

    if (account.class === 'CATEGORY') {
      // First update all line_items associated with the account if any
      await DatabaseManager.getConnection()
        .createQueryBuilder()
        .update(LineItemEntity)
        .set({ account_id: reassignId })
        .where('account_id = :account_id', { account_id: id })
        .execute()
    }

    // Finally delete the account
    await accountsRepo.delete(id)

    // For class 'ACCOUNT' drop any currencies if no more accounts with that currency exist
    if (account.class === 'ACCOUNT') {
      const currencies = await this.listAccountCurrencies()
      if (
        account.acc_iso_currency &&
        !currencies.foreign_currencies.includes(account.acc_iso_currency)
      ) {
        await CommandsClient.executeAppCommand(AppCommandIds.RUN_DATASET_QUERY, {
          datasetName: 'currencies',
          queryName: 'dropCurrency',
          params: [account.acc_iso_currency],
        })
      }
    }
  }

  /** Sanitize and Validate Account fields to ensure Account is correctly stored
   *
   * @param account   The Account to sanitize
   */
  private async _sanitizeAndValidate(account: Partial<IAccount>): Promise<Partial<IAccount>> {
    // Sanitize Account
    if (account.name) {
      account.name = account.name.trim()
    }

    switch (account.class) {
      case 'ACCOUNT': {
        // Ensure all CATEGORY fields aren't set
        account.cat_group_id = undefined
        account.cat_type = undefined
        account.cat_description = undefined
        account.cat_icon = undefined

        break
      }
      case 'CATEGORY': {
        if (!account.cat_icon) {
          // Set to question mark icon if not set already
          account.cat_icon = 'question'
        }

        // Ensure all ACCOUNT fields aren't set
        account.acc_institution_id = undefined
        account.acc_owners = undefined
        account.acc_sort = undefined
        account.acc_number = undefined
        account.acc_mask = undefined
        account.acc_type = undefined
        account.acc_subtype = undefined
        account.acc_iso_currency = undefined
        account.acc_start_balance = 0
        account.acc_interest_rate = 0
        account.acc_limit = 0
        account.acc_is_open = true

        break
      }
      default: {
        throw Error('Validation Error: No class set for Account')
      }
    }

    // Finally validate entity
    const errors = await validate(AccountEntity.getClassInstance(account), {
      forbidUnknownValues: true,
    })
    if (errors.length > 0) {
      const errorMsg = 'Cannot save AccountEntity as it failed validation'
      logger.error(errorMsg, errors)
      throw Error(errorMsg)
    }

    return account
  }

  /**
   * Helper function to get the local current balances for all accounts that are not in the book currency
   * If the currency is not synced yet in dataset database, then the local_current_balance will be the same
   * as current_balance until next sync.
   *
   * @param accounts        The accounts to get the local current balances for
   * @returns               The accounts with the local current balances set
   */
  private async _getLocalBalances(accounts: AccountEntity[]): Promise<AccountEntity[]> {
    const currencies = await this.listAccountCurrencies()
    if (currencies.foreign_currencies.length === 0) {
      logger.debug(
        'No foreign currency accounts found, returning current balance as local current balance',
      )
      return accounts.map((account) => {
        if (account.class === 'ACCOUNT') {
          account.local_current_balance = account.current_balance
        }
        return account
      })
    }

    // Get the latest spot exchange rates
    const exchangeRates: any[] = await CommandsClient.executeAppCommand(
      AppCommandIds.RUN_DATASET_QUERY,
      {
        datasetName: 'currencies',
        queryName: 'latestRates',
      },
    )
    if (!exchangeRates || exchangeRates.length === 0) {
      // If no exchange rates are found, then return local_current_balance as the same as current_balance for now
      logger.warn('No exchange rates found, returning current balance as local current balance')
      return accounts.map((account) => {
        if (account.class === 'ACCOUNT') {
          account.local_current_balance = account.current_balance
        }
        return account
      })
    }

    // Get the exchange rate for each foreign currency, if we don't have an exchange rate for a currency, then
    // just return without converting the balance
    return accounts.map((account) => {
      if (
        account.class === 'ACCOUNT' &&
        account.acc_iso_currency?.toUpperCase() !== currencies.default_currency
      ) {
        const exchangeRate = exchangeRates.find(
          (rate) => rate.currency === account.acc_iso_currency?.toUpperCase(),
        )
        if (exchangeRate) {
          account.local_current_balance = Number(
            (account.current_balance / exchangeRate.rate).toFixed(2),
          )
        } else {
          logger.warn(
            `No exchange rate found for currency: ${account.acc_iso_currency}, returning current balance as local current balance`,
          )
          account.local_current_balance = account.current_balance
        }
      } else {
        account.local_current_balance = account.current_balance
      }
      return account
    })
  }
}

// Export instance of Class
export const AccountService = new AccountServiceClass()
