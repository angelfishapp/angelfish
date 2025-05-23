import type { CurrencyCodes } from '@angelfish/cloudapiclient'
import type { AppCommandRequest, AppCommandResponse, ITransactionUpdate } from '@angelfish/core'
import {
  AppCommandIds,
  AppEventIds,
  Command,
  CommandsClient,
  Logger,
  updateTransaction,
} from '@angelfish/core'
import { LocalCommandIds, executeLocalCommand } from '../../local-commands'
import {
  compareObjects,
  findMissingDateRanges,
  formatDateString,
  parseDate,
} from './sync-service-utils'

const logger = Logger.scope('SyncService')

/**
 * Service to syncronize book and other data with the Cloud APIs.
 *
 * Emits events to allow other services to listen so can keep updated as the sync happens:
 *
 *      * 'on.sync.started':  Triggers when sync is started
 *      * 'on.sync.finished': Triggers after sync completes. Will return if successful and
 *                            any errors raised during sync
 */
class SyncServiceClass {
  /**
   * Sync Command to start the sync process with the Cloud APIs. If request has no properties
   * set it will run full sync, otherwise it will selectively sync data based on the properties
   * allowing for partial syncs.
   *
   * @param user        If true, will sync the user's profile data
   * @param currencies  If true, will sync any currency data for currencies the user has accounts for
   * @returns           ISyncSummary object with the results of the sync
   */
  @Command(AppCommandIds.START_SYNC)
  public async sync(
    request: AppCommandRequest<AppCommandIds.START_SYNC>,
  ): AppCommandResponse<AppCommandIds.START_SYNC> {
    const { user, currencies } = request ?? {}
    // If no properties are set, execute everything
    const runAll = !user && !currencies

    logger.info('🔄 Starting Sync Process...', { runAll, user, currencies })
    CommandsClient.emitAppEvent(AppEventIds.ON_SYNC_STARTED)
    let syncStatus = {
      completed: false,
      errorMessage: undefined,
    }
    const syncStart = Date.now()

    try {
      if (runAll || user) {
        await this._syncUserProfile()
      }
      if (runAll || currencies) {
        await this._syncCurrencyRates()
      }

      syncStatus = {
        completed: true,
        errorMessage: undefined,
      }
    } catch (error: any) {
      syncStatus = {
        completed: false,
        errorMessage: error.message,
      }
    }

    // Return sync status
    const syncEnd = Date.now()
    const syncDuration = syncEnd - syncStart
    logger.info(
      `🔄 Finished Sync Process in ${syncDuration} milliseconds: success=${syncStatus.completed}, error=${syncStatus.errorMessage}`,
    )
    CommandsClient.emitAppEvent(AppEventIds.ON_SYNC_FINISHED, syncStatus)
    return syncStatus
  }

  /**
   * Sync User Profile Data with Cloud APIs
   */
  private async _syncUserProfile() {
    logger.info('********** Syncing User Profile Data')
    // Get User Profile from Cloud and database, and determine if different
    // and which one is newer
    const cloudProfile = await executeLocalCommand(LocalCommandIds.CLOUD_API_GET_USER_PROFILE)
    const localProfile = await CommandsClient.executeAppCommand(AppCommandIds.GET_USER, {
      cloud_id: cloudProfile.id,
    })
    if (!localProfile) {
      // No need to compare, create user in database
      await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, {
        email: cloudProfile.email,
        cloud_id: cloudProfile.id,
        first_name: cloudProfile.first_name,
        last_name: cloudProfile.last_name,
        avatar: cloudProfile.avatar,
        phone: cloudProfile.phone,
      })
      return
    }

    // Otherwise compare and determine which is newer
    const comparison = compareObjects(cloudProfile, localProfile)
    if (comparison === -1) {
      // CloudProfile is newer, update local profile
      await CommandsClient.executeAppCommand(AppCommandIds.SAVE_USER, {
        ...localProfile,
        email: cloudProfile.email,
        first_name: cloudProfile.first_name,
        last_name: cloudProfile.last_name,
        avatar: cloudProfile.avatar,
        phone: cloudProfile.phone,
      })
      logger.info('Updated Local Profile with Cloud Data')
    } else if (comparison === 1) {
      // LocalProfile is newer, update cloud profile
      await executeLocalCommand(LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE, {
        first_name: localProfile.first_name,
        last_name: localProfile.last_name,
        avatar: localProfile.avatar,
        phone: localProfile.phone,
      })
      logger.info('Updated Cloud Profile with Local Data')
    } else {
      logger.info('No Changes to User Profile Data')
    }

    return
  }

  /**
   * Sync Currency Rates with Cloud APIs
   */
  private async _syncCurrencyRates() {
    logger.info('********** Syncing Currency Rates')

    // Check 'currency' dataset exists
    if (
      !(await CommandsClient.executeAppCommand(AppCommandIds.LIST_DATASETS)).includes('currencies')
    ) {
      throw new Error('Dataset "currencies" not registered. Cannot sync currency rates.')
    }

    // Get list of all bank account currencies and book currency in the database
    const accountCurrencies = await CommandsClient.executeAppCommand(
      AppCommandIds.LIST_ACCOUNT_CURRENCIES,
    )
    logger.debug(
      `Default Currency: ${accountCurrencies.default_currency}, Foreign Currencies: ${accountCurrencies.foreign_currencies}`,
    )

    if (accountCurrencies.foreign_currencies.length > 0) {
      /**
       * Sync Latest (Spot) Currency Rates
       */
      logger.info(
        `Syncing Latest (Spot) Currency Rates for ${accountCurrencies.foreign_currencies} with ${accountCurrencies.default_currency}`,
      )

      const latestRates = await executeLocalCommand(LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES, {
        base: accountCurrencies.default_currency as CurrencyCodes,
        currencies: accountCurrencies.foreign_currencies as CurrencyCodes[],
      })
      logger.debug(
        `Received ${Object.keys(latestRates.rates).length} spot rates for ${accountCurrencies.foreign_currencies}`,
      )
      const latestData = Object.entries(latestRates.rates).map(([currency, rate]) => ({
        date: 'LATEST',
        currency,
        rate,
      }))
      await CommandsClient.executeAppCommand(AppCommandIds.INSERT_DATASET_ROWS, {
        datasetName: 'currencies',
        rows: latestData,
      })

      /**
       * Sync Historical Currency Rates
       */

      logger.info('Syncing Historical Foreign Currency Rates')

      // Get date 1 year ago
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(new Date().getFullYear() - 1)

      // Determine the earliest transaction in database, if none exists or its less than 1 year old,
      // set start date to 1 year ago from today, otherwise set to the earliest transaction date
      const transactionDateRange = await CommandsClient.executeAppCommand(
        AppCommandIds.GET_TRANSACTIONS_DATE_RANGE,
      )

      // Determine the max date range based on Transaction dates or today - 1 year ago
      const maxDateRange = findMissingDateRanges(
        [
          transactionDateRange.start_date ? parseDate(transactionDateRange.start_date) : null,
          transactionDateRange.end_date ? parseDate(transactionDateRange.end_date) : null,
          oneYearAgo,
          new Date(),
        ],
        null,
        null,
      )[0]

      logger.debug(
        `Earliest Transaction Date: ${
          transactionDateRange.start_date
            ? formatDateString(parseDate(transactionDateRange.start_date))
            : 'None'
        }`,
        `Latest Transaction Date: ${
          transactionDateRange.end_date
            ? formatDateString(parseDate(transactionDateRange.end_date))
            : 'None'
        }`,
        `Today: ${formatDateString(new Date())}`,
        `One Year Ago: ${formatDateString(oneYearAgo)}`,
        `Min: ${maxDateRange.start}`,
        `Max: ${maxDateRange.end}`,
      )

      for (const foreignCurrency of accountCurrencies.foreign_currencies) {
        // Get the first and last date of any currency rates already stored in dataset
        const datasetResults = await CommandsClient.executeAppCommand(
          AppCommandIds.RUN_DATASET_QUERY,
          {
            datasetName: 'currencies',
            queryName: 'datasetDateRange',
            params: [foreignCurrency],
          },
        )

        // Determine the missing date ranges for the currency
        const missingDateRanges = findMissingDateRanges(
          [maxDateRange.start, maxDateRange.end],
          datasetResults[0]?.start ? parseDate(datasetResults[0].start) : null,
          datasetResults[0]?.end ? parseDate(datasetResults[0].end) : null,
        )

        for (const dateRange of missingDateRanges) {
          logger.info(
            `Syncing Foreign Currency Rates for ${foreignCurrency} between ${dateRange.start} and ${dateRange.end}`,
          )
          const rates = await executeLocalCommand(
            LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES,
            {
              base: accountCurrencies.default_currency as CurrencyCodes,
              currency: foreignCurrency as CurrencyCodes,
              startDate: formatDateString(dateRange.start),
              endDate: formatDateString(dateRange.end),
            },
          )
          logger.debug(`Received ${Object.keys(rates.rates).length} rates for ${foreignCurrency}`)
          logger.silly(`API Rates for ${foreignCurrency}`, rates.rates)

          // Convert each rate into a dataset row and insert into database with formate { date, currency, rate }
          const data = Object.entries(rates.rates).map(([dateStr, rate]) => ({
            date: dateStr,
            currency: foreignCurrency,
            rate,
          }))
          await CommandsClient.executeAppCommand(AppCommandIds.INSERT_DATASET_ROWS, {
            datasetName: 'currencies',
            rows: data,
          })
        }
      }
    } else {
      logger.info('No Foreign Currencies to Sync')
    }

    /**
     * Sync Transactions with require_sync === true
     */

    logger.info('Updating Transactions with require_sync=true')
    // Use batch size of 100 to update transactions
    // to avoid hitting the database transaction limit
    const batchSize = 100

    const allCurrencies = [
      ...accountCurrencies.foreign_currencies,
      accountCurrencies.default_currency,
    ]
    for (const currency of allCurrencies) {
      const reviewTransactions = await CommandsClient.executeAppCommand(
        AppCommandIds.LIST_TRANSACTIONS,
        {
          requires_sync: true,
          currency_code: currency,
        },
      )
      logger.debug(
        `Updating ${reviewTransactions.length} transactions with require_sync=true and currency_code=${currency}`,
      )

      let rates
      if (currency !== accountCurrencies.default_currency) {
        // Get exchange rates cached earlier in dataset service
        rates = await CommandsClient.executeAppCommand(AppCommandIds.RUN_DATASET_QUERY, {
          datasetName: 'currencies',
          queryName: 'getAllRates',
          params: [currency],
        })
      }

      for (let i = 0; i < reviewTransactions.length; i += batchSize) {
        const batch = reviewTransactions.slice(i, i + batchSize)
        const updatedTransactions: ITransactionUpdate[] = []
        for (const transaction of batch) {
          // Get the exchange rate for the same day as the transaction
          let exchange_rate = 1
          if (currency !== accountCurrencies.default_currency) {
            const date = formatDateString(transaction.date)
            const rate = rates?.find((entry) => entry.date === date)
            if (rate) {
              exchange_rate = rate.rate as number
            } else {
              logger.warn(`No exchange rate found for ${transaction.currency_code} on ${date}`)
              continue
            }
          }

          // Update transaction to not require sync
          const updatedTransaction = updateTransaction(transaction, {
            currency_exchange_rate: exchange_rate,
            requires_sync: false,
          })
          updatedTransactions.push(updatedTransaction)
        }
        if (updatedTransactions.length > 0) {
          logger.debug(`Saving ${updatedTransactions.length} Transactions...`)
          await CommandsClient.executeAppCommand(
            AppCommandIds.SAVE_TRANSACTIONS,
            updatedTransactions,
          )
        }
      }
    }
  }
}

// Export instance of Class
export const SyncService = new SyncServiceClass()
