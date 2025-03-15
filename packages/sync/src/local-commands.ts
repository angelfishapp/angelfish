import type {
  Currency,
  CurrencyCodes,
  HistoricalCurrencyExchangeRates,
  LatestCurrencyExchangeRates,
  TokenResponse,
} from '@angelfish/cloudapiclient'
import type { IAuthenticatedUser, IAuthenticatedUserUpdate } from '@angelfish/core'
import { CommandsClient } from '@angelfish/core'

/**
 * Local Commands for Sync Process, must all start with an underscore to ensure
 * they are only available locally to the process that registered them.
 */
export enum LocalCommandIds {
  /**
   * Initialise the API Client with the given refresh token
   */
  INIT_API_CLIENT = '_api.init.client',
  /**
   * Call Cloud API to send an Out-Of-Band (OOB) Code to the given email
   */
  CLOUD_API_SEND_OOB_CODE = '_api.send.oob.code',
  /**
   * Call Cloud API to authenticate a user with the given OOB Code
   */
  CLOUD_API_AUTHENTICATE = '_api.authenticate',
  /**
   * Cloud Cloud API to logout user
   */
  CLOUD_API_LOGOUT = '_api.logout',
  /**
   * Call Cloud API to get the authenticated user's profile
   */
  CLOUD_API_GET_USER_PROFILE = '_api.get.user.profile',
  /**
   * Call Cloud API to update the authenticated user's profile
   */
  CLOUD_API_UPDATE_USER_PROFILE = '_api.update.user.profile',
  /**
   * Get the list of all available currencies from Cloud API
   */
  CLOUD_GET_CURRENCIES = '_api.get.currencies',
  /**
   * Get the current spot currency rates from Cloud API
   * for a given base currency and list of currencies
   */
  CLOUD_GET_SPOT_CURRENCY_RATES = '_api.get.spot.currency.rates',
  /**
   * Get the daily historical currency rates from Cloud API
   * for a given base currency and currency between two dates
   */
  CLOUD_GET_HISTORICAL_CURRENCY_RATES = '_api.get.historical.currency.rates',
}

// Define request/response types for each command
export interface LocalCommandDefinitions {
  [LocalCommandIds.INIT_API_CLIENT]: {
    request: { refreshToken: string }
    response: void
  }
  [LocalCommandIds.CLOUD_API_SEND_OOB_CODE]: {
    request: { email: string }
    response: string
  }
  [LocalCommandIds.CLOUD_API_AUTHENTICATE]: {
    request: { session_id: string; oob_code: string }
    response: TokenResponse
  }
  [LocalCommandIds.CLOUD_API_LOGOUT]: {
    request: void
    response: void
  }
  [LocalCommandIds.CLOUD_API_GET_USER_PROFILE]: {
    request: void
    response: IAuthenticatedUser
  }
  [LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE]: {
    request: IAuthenticatedUserUpdate
    response: IAuthenticatedUser
  }
  [LocalCommandIds.CLOUD_GET_CURRENCIES]: {
    request: void
    response: Currency[]
  }
  [LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES]: {
    request: { base: CurrencyCodes; currencies: CurrencyCodes[] }
    response: LatestCurrencyExchangeRates
  }
  [LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES]: {
    request: { base: CurrencyCodes; currency: CurrencyCodes; startDate: string; endDate: string }
    response: HistoricalCurrencyExchangeRates
  }
}

// Type-safe utility to get request/response types dynamically
export type LocalCommandRequest<T extends LocalCommandIds> = LocalCommandDefinitions[T]['request']
export type LocalCommandResponse<T extends LocalCommandIds> = Promise<
  LocalCommandDefinitions[T]['response']
>

/**
 * Execute a local commmand with type safety
 *
 * @param command   The command ID to execute
 * @param payload   The payload to pass to the command handler
 * @returns         A promise that resolves with the return value of the command handler
 */
export async function executeLocalCommand<T extends LocalCommandIds>(
  command: T,
  ...args: LocalCommandRequest<T> extends void ? [] : [LocalCommandRequest<T>]
): LocalCommandResponse<T> {
  return CommandsClient.executeCommand(
    command,
    ...(args as [LocalCommandRequest<T>]),
  ) as LocalCommandResponse<T>
}
