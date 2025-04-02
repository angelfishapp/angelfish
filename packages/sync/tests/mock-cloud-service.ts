import type { CurrencyCodes } from '@angelfish/cloudapiclient'
import type { AppCommandRequest, AppCommandResponse } from '@angelfish/core'
import { AppCommandIds, Command, Logger, allCurrencies } from '@angelfish/core'
import type { LocalCommandRequest, LocalCommandResponse } from '../src/local-commands'
import { LocalCommandIds } from '../src/local-commands'

import { authenticatedUser, searchInstitutions } from '@angelfish/tests'

const logger = Logger.scope('MockCloudService')

/**
 * Mock Cloud Service for tests without calling Cloud APIs
 */
class MockCloudServiceClass {
  /**
   * Initialise the API Client with authentication tokens. This is called from the AuthService
   * when initialised or new user is authenticated into App.
   */
  @Command(LocalCommandIds.INIT_API_CLIENT)
  public async initialiseAPIClient({
    refreshToken,
  }: LocalCommandRequest<LocalCommandIds.INIT_API_CLIENT>): LocalCommandResponse<LocalCommandIds.INIT_API_CLIENT> {
    logger.debug('Initialising API Client with refresh token', refreshToken)
  }

  /**
   * Get an OOB Code for the given email
   *
   * @param email   The email address to send the OOB Code to
   * @returns       The session ID for the OOB Code
   */
  @Command(LocalCommandIds.CLOUD_API_SEND_OOB_CODE)
  public async sendOOBCode({
    email,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_API_SEND_OOB_CODE>): LocalCommandResponse<LocalCommandIds.CLOUD_API_SEND_OOB_CODE> {
    logger.debug(`Sending OOB Code to ${email}`)
    return '7740ba7a-a816-44c1-a2ba-d6d9f8bcf946'
  }

  /**
   * Authenticate a user with the given OOB Code for the given session ID they received
   * getting the OOB Code
   *
   * @param session_id  The session_id returned when getting the OOB Code
   * @param oob_code    The OOB Code the user received in their email
   * @returns           A TokenResponse containing the JWT access token and refresh token
   */
  @Command(LocalCommandIds.CLOUD_API_AUTHENTICATE)
  public async authenticate({
    session_id,
    oob_code,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_API_AUTHENTICATE>): LocalCommandResponse<LocalCommandIds.CLOUD_API_AUTHENTICATE> {
    logger.debug(`Authenticating OOB Code ${oob_code} for session ID ${session_id}`)
    return {
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbmdlbGZpc2guYXBwIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmFuZ2VsZmlzaC5hcHAiLCJzdWIiOiJiNDY4NGMyMy1mZDExLTQ0ZDgtYjNiNi1jNDM4MzNjZWE4YTEiLCJlbWFpbCI6InRlc3RAYW5nZWxmaXNoLmFwcCIsImV4cCI6MTc0MzYxOTU4Mn0.Cweh7ASNOUX3zDjBHD4NPnNyj9_Zx_4tc6SjHdoIxOrU1r3fYo59sAkK6PvKUbQWB3DC9DsxQWYr8_45xPs7_9iONw3OyT0hvu9tNeXY7CjUqrBaAc-577Qx5-Bmycd3AkxEvxWyoJC47Ndc_y-nQ67D4VYbCa_4olH4HFxOPzWrL_OhOh7xgia5Y7rRpEbFbXhhUXF24nTKIqxvcrQtZOqXP2NI7bEf2EY8c4K9FUILJazR45EvOo9XqsrKUD_LCKr2twO4ZYvOykewbmfteC70AShr7ufDSO-aYGPXTJ2Mdc3ghLF02dqxOLDqKFvZUQwyvblbJZ8d3vJjD9fZ2w',
      refresh_token:
        '1ef788e636db28b9b568f53a6ee7e3967aa9685d35af79a5ad4af644b39fc16ea79ba8f6ac692c8baa972a89ad0cf46e381dda6d91edb874ec1d207361371ae0a7e1c61b8c3bc0d5b6292d1d76bdbcb6e5a4dbdbcbe1ecb2841f89fe3bd2a7c8f6ff85c5667c14c661621724d45fc230ab74a2bbac55f6d91bdb8faf03ca9317b2f2aba7440e6c2f4e9983adcdb04a14623d646c385bff868c41c3d754bac65ac9b6c119452f8477bb9d2edd854941d7782034c5543dfcb0fbfc7ca1249c76f2d7544b712b5b82ab32c7d947ecebe6ffd45f373ba669f61ae1d95cffaaafc9eb4b9c2a2f411123f63542f95df65af786f3a4fb52d23a2f85927',
    }
  }

  /**
   * Logout the user with the given JWT access token. This will delete all their
   * refresh tokens so they can no longer use it to refresh their access token.
   * Note if their current JWT token hasn't expired yet, they will still be able
   * to use it until it expires so it should be discarded to ensure the user no
   * longer has access to the Cloud APIs.
   *
   * @param token  The JWT access token to logout with
   */
  @Command(LocalCommandIds.CLOUD_API_LOGOUT)
  public async logout(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_API_LOGOUT>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_LOGOUT> {
    logger.debug('Logging out user')
  }

  /**
   * Get the current authenticated user profile
   *
   * @returns   The current authenticated user profile
   * @throws    UnauthorizedError if not authenticated
   */
  @Command(LocalCommandIds.CLOUD_API_GET_USER_PROFILE)
  public async getUserProfile(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_API_GET_USER_PROFILE>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_GET_USER_PROFILE> {
    return authenticatedUser
  }

  /**
   * Update the current authenticated user profile
   *
   * @param user    The local updated user profile
   * @returns       The remote updated user profile
   */
  @Command(LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE)
  public async updateUserProfile(
    user: LocalCommandRequest<LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE> {
    // Update Cloud with local data
    const requestBody = Object.fromEntries(
      Object.entries({
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        phone: user.phone,
      }).filter(([_, value]) => value != null), // Remove null and undefined values
    )
    logger.debug('Updating User Profile Data on Cloud', user, requestBody)
    return {
      ...authenticatedUser,
      ...requestBody,
    }
  }

  /**
   * Search all the available Institutions in the API.
   *
   * @param query     Query string to search Institution name
   * @returns         Promise<IInstitutionUpdate[]>
   */
  @Command(AppCommandIds.SEARCH_INSTITUTIONS)
  public async searchInstitutions({
    query,
  }: AppCommandRequest<AppCommandIds.SEARCH_INSTITUTIONS>): AppCommandResponse<AppCommandIds.SEARCH_INSTITUTIONS> {
    return await searchInstitutions(query)
  }

  /**
   * Get all the available currencies from the API
   *
   * @returns   Promise<Currency[]>
   */
  @Command(LocalCommandIds.CLOUD_GET_CURRENCIES)
  public async getCurrencies(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_GET_CURRENCIES>,
  ): Promise<LocalCommandResponse<LocalCommandIds.CLOUD_GET_CURRENCIES>> {
    return allCurrencies.map((currency) => ({
      code: currency.code as CurrencyCodes,
      name: currency.name,
      symbol: currency.symbol,
      flag: currency.flag,
    }))
  }

  /**
   * Get the latest spot currency rates for the given base currency and list of currencies
   *
   * @param base        The base currency to get exchange rates for (i.e. USD)
   * @param currencies  The list of currencies to get exchange rates for (i.e. ['EUR', 'GBP'])
   * @returns           Promise<LatestCurrencyExchangeRates
   */
  @Command(LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES)
  public async getSpotCurrencyRates({
    currencies,
    base,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES>): LocalCommandResponse<LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES> {
    logger.debug(`Getting Spot Currency Rates for currencies ${currencies} for base ${base}`)
    return {
      base: 'USD',
      rates: {
        EUR: 0.9261,
        GBP: 0.7738,
        USD: 1,
      },
    }
  }

  /**
   * Get the historical currency rates for the given base currency and currency
   *
   * @param base        The base currency to get exchange rates for (i.e. USD)
   * @param currency    The currency to get exchange rates for (i.e. EUR)
   * @param startDate   The start date for the historical data in YYYY-MM-DD format
   * @param endDate     The end date for the historical data in YYYY-MM-DD format
   * @returns           Promise<HistoricalCurrencyExchangeRates>
   */
  @Command(LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES)
  public async getHistoricCurrencyRates({
    currency,
    startDate,
    endDate,
    base,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES>): LocalCommandResponse<LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES> {
    logger.debug(
      `Getting Historical Currency Rates for currency ${currency} for base ${base} from ${startDate} to ${endDate}`,
    )
    return {
      currency: currency as CurrencyCodes,
      base: base as CurrencyCodes,
      start_date: startDate,
      end_date: endDate,
      rates: {
        '2025-03-31': 0.9244,
        '2025-03-30': 0.9238,
        '2025-03-29': 0.9195,
        '2025-03-28': 0.9195,
        '2025-03-27': 0.9259,
        '2025-03-26': 0.931,
        '2025-03-25': 0.9269,
        '2025-03-24': 0.9257,
        '2025-03-23': 0.9228,
        '2025-03-22': 0.9196,
        '2025-03-21': 0.9194,
        '2025-03-20': 0.9214,
        '2025-03-19': 0.9164,
        '2025-03-18': 0.9142,
        '2025-03-17': 0.9159,
        '2025-03-16': 0.9191,
        '2025-03-15': 0.916,
        '2025-03-14': 0.9155,
        '2025-03-13': 0.9212,
        '2025-03-12': 0.9186,
        '2025-03-11': 0.9162,
        '2025-03-10': 0.9226,
        '2025-03-09': 0.9208,
        '2025-03-08': 0.9232,
        '2025-03-07': 0.9229,
        '2025-03-06': 0.927,
        '2025-03-05': 0.9264,
        '2025-03-04': 0.9413,
        '2025-03-03': 0.9537,
        '2025-03-02': 0.9604,
        '2025-03-01': 0.9636,
      },
    }
  }
}

// Export instance of Class
export const MockCloudService = new MockCloudServiceClass()
