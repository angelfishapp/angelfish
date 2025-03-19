import { validate } from 'class-validator'

import type { AppCommandRequest, AppCommandResponse, IAccount } from '@angelfish/core'
import { AppCommandIds, Command } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { AccountEntity, LineItemEntity, TransactionEntity } from '../../database/entities'
import { getWorkerLogger } from '../../logger'

const logger = getWorkerLogger('AccountService')

/**
 * Manage Accounts in database.
 */
class AccountServiceClass {
  // SQL Select Statement to calculate current balance of the account
  private readonly BALANCE_SELECT =
    'ROUND(COALESCE(SUM(transactions.amount), 0) + COALESCE(account.acc_start_balance, 0), 2)'

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
    query.addSelect(this.BALANCE_SELECT, 'account_current_balance')
    query.leftJoin(TransactionEntity, 'transactions', 'transactions.account_id = account.id')
    query.leftJoinAndSelect('account.acc_owners', 'users')

    // Add Where Clause
    if (account_class) {
      query.where('account.class = :typeClass', { typeClass: account_class })
    } else if (category_group_id) {
      query.where('account.categoryGroupID = :categoryGroupID', {
        categoryGroupID: category_group_id,
      })
    } else if (institution_id) {
      query.where('account.institutionID = :institutionID', { institutionID: institution_id })
    }

    // Run query
    query.groupBy('account.id, users.id')
    return await query.getMany()

    // For accounts of Class 'ACCOUNT', convert current_balance to Book's default currency
    // return getLocalCurrentBalances(
    //   accounts,
    //   this.currentBook?.default_currency as string,
    //   this.datasetService,
    // )
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
    query.addSelect(this.BALANCE_SELECT, 'account_current_balance')
    query.leftJoin(TransactionEntity, 'transactions', 'transactions.account_id = account.id')
    query.leftJoinAndSelect('account.acc_owners', 'users')
    query.where('account.id = :id', { id })
    query.groupBy('account.id, users.id')
    return await query.getOne()
  }

  /**
   *  Get an Accounts from the database
   *
   * @returns        A list of all Accounts in the database
   */
  @Command(AppCommandIds.SAVE_ACCOUNT)
  public async saveAccount(
    account: AppCommandRequest<AppCommandIds.SAVE_ACCOUNT>,
  ): AppCommandResponse<AppCommandIds.SAVE_ACCOUNT> {
    await this._sanitizeAndValidate(account)
    const savedAccount = await DatabaseManager.getConnection()
      .getRepository(AccountEntity)
      .save(account)
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
    // First update all line_items associated with the account if any
    await DatabaseManager.getConnection()
      .createQueryBuilder()
      .update(LineItemEntity)
      .set({ account_id: reassignId })
      .where('account_id = :account_id', { account_id: id })
      .execute()

    // Finally delete the account
    const accountsRepo = DatabaseManager.getConnection().getRepository(AccountEntity)
    await accountsRepo.delete(id)
  }

  /** Sanitize and Validate Account fields to ensure Account is correctly stored
   *
   * @param account   The Account to sanitize
   */
  private async _sanitizeAndValidate(account: Partial<IAccount>): Promise<void> {
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
  }
}

// Export instance of Class
export const AccountService = new AccountServiceClass()
