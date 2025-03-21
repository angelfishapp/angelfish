import type { TokenResponse } from '@angelfish/cloudapiclient'
import {
  CloudAuthAPIs,
  CloudV1APIs,
  JWTAuthHelper,
  UnauthorizedError,
  convertCloudUserProfile,
} from '@angelfish/cloudapiclient'
import type { AppCommandRequest, AppCommandResponse, IInstitutionUpdate } from '@angelfish/core'
import { AppCommandIds, Command, CommandsClient, Logger } from '@angelfish/core'
import type { LocalCommandRequest, LocalCommandResponse } from '../../local-commands'
import { LocalCommandIds } from '../../local-commands'
import { HandleCloudError } from './cloud-error-decorator'

const logger = Logger.scope('CloudService')

// API Endpoints
const AUTH_API_URL = 'https://auth.angelfish.app'
const API_URL = 'https://api.angelfish.app'

/**
 * Service to call the Cloud APIs with authentication and online/offline handling
 */
class CloudServiceClass {
  // CloudAuthAPIs instance to call the Cloud Auth APIs
  private _authAPI: CloudAuthAPIs = new CloudAuthAPIs(AUTH_API_URL)
  // CloudV1APIs instance to call the Cloud V1 APIs
  private _v1API?: CloudV1APIs = undefined
  // Current JWT token used for authentication
  private _current_jwt_token?: string = undefined

  /**
   * Initialise the API Client with authentication tokens. This is called from the AuthService
   * when initialised or new user is authenticated into App.
   */
  @Command(LocalCommandIds.INIT_API_CLIENT)
  @HandleCloudError
  public async initialiseAPIClient({
    refreshToken,
  }: LocalCommandRequest<LocalCommandIds.INIT_API_CLIENT>): LocalCommandResponse<LocalCommandIds.INIT_API_CLIENT> {
    if (!refreshToken) {
      throw new Error('No refresh token provided to initialise API Client')
    }

    // Get a new JWT Token and set the V1 API Client
    const tokenResponse = await this._refreshToken(refreshToken)

    // Create a new JWTAuthHelper instance with the new token and refresh token
    const jwtAuthHelper = new JWTAuthHelper(
      tokenResponse.token,
      tokenResponse.refresh_token,
      async (refresh_token: string): Promise<TokenResponse> => {
        logger.debug('Refreshing JWT Token with refresh token')
        return await this._refreshToken(refresh_token)
      },
    )

    // Set the V1 API Client
    this._v1API = new CloudV1APIs(
      API_URL,
      AUTH_API_URL,
      jwtAuthHelper.refreshToken.bind(jwtAuthHelper),
    )
  }

  /**
   * Get the authenticated V1 API Client
   *
   * @returns The authenticated V1 API Client
   * @throws  UnauthorizedError if not authenticated
   */
  private _getAuthenticatedClient(): CloudV1APIs {
    if (!this._v1API) {
      throw new UnauthorizedError()
    }
    return this._v1API
  }

  /**
   * Get an OOB Code for the given email
   *
   * @param email   The email address to send the OOB Code to
   * @returns       The session ID for the OOB Code
   */
  @Command(LocalCommandIds.CLOUD_API_SEND_OOB_CODE)
  @HandleCloudError
  public async sendOOBCode({
    email,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_API_SEND_OOB_CODE>): LocalCommandResponse<LocalCommandIds.CLOUD_API_SEND_OOB_CODE> {
    const session_id = await this._authAPI.getOOBCode(email)
    return session_id
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
  @HandleCloudError
  public async authenticate({
    session_id,
    oob_code,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_API_AUTHENTICATE>): LocalCommandResponse<LocalCommandIds.CLOUD_API_AUTHENTICATE> {
    const tokenResponse = await this._authAPI.authenticate('oob_code', session_id, {
      oob_code,
    })
    return tokenResponse
  }

  /**
   * Get a new access token and refresh token using the given refresh token
   *
   * @param refreshToken    The current refresh token
   * @returns               A TokenResponse containing the new JWT access token and refresh token
   */
  @HandleCloudError
  private async _refreshToken(refreshToken: string): Promise<TokenResponse> {
    logger.info('Refreshing JWT Token with refresh token', refreshToken)
    const tokenResponse = await this._authAPI.refreshToken(refreshToken)
    // Save new refresh token to local storage
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      refreshToken: tokenResponse.refresh_token,
    })
    // Set the current JWT token to the new token
    this._current_jwt_token = tokenResponse.token
    return tokenResponse
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
  @HandleCloudError
  public async logout(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_API_LOGOUT>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_LOGOUT> {
    if (this._current_jwt_token) {
      await this._authAPI.logout(this._current_jwt_token)
    }
  }

  /**
   * Get the current authenticated user profile
   *
   * @returns   The current authenticated user profile
   * @throws    UnauthorizedError if not authenticated
   */
  @Command(LocalCommandIds.CLOUD_API_GET_USER_PROFILE)
  @HandleCloudError
  public async getUserProfile(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_API_GET_USER_PROFILE>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_GET_USER_PROFILE> {
    const userProfile = await this._getAuthenticatedClient().userAPI.getUser()
    return convertCloudUserProfile(userProfile.data)
  }

  /**
   * Update the current authenticated user profile
   *
   * @param user    The local updated user profile
   * @returns       The remote updated user profile
   */
  @Command(LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE)
  @HandleCloudError
  public async updateUserProfile(
    user: LocalCommandRequest<LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE>,
  ): LocalCommandResponse<LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE> {
    // Update Cloud with local data
    const requestBody = Object.fromEntries(
      Object.entries({
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        phone_number: user.phone,
      }).filter(([_, value]) => value != null), // Remove null and undefined values
    )
    logger.debug('Updating User Profile Data on Cloud', user, requestBody)
    const userProfile = await this._getAuthenticatedClient().userAPI.updateUser(requestBody)
    return convertCloudUserProfile(userProfile.data)
  }

  /**
   * Search all the available Institutions in the API.
   *
   * @param query     Query string to search Institution name
   * @returns         Promise<IInstitutionUpdate[]>
   */
  @Command(AppCommandIds.SEARCH_INSTITUTIONS)
  @HandleCloudError
  public async searchInstitutions(
    request: AppCommandRequest<AppCommandIds.SEARCH_INSTITUTIONS>,
  ): AppCommandResponse<AppCommandIds.SEARCH_INSTITUTIONS> {
    const institutions: IInstitutionUpdate[] = []
    const response = await this._getAuthenticatedClient().institutionAPI.searchInstitutions(
      request.query,
    )
    if (response.status == 200) {
      // Convert to IInstitutionUpdate, Select First Country Code in List
      for (const bank of response.data) {
        institutions.push({
          name: bank.name,
          url: bank.url,
          country: bank.country_codes[0],
          logo: bank.logo,
        })
      }
    }
    return institutions
  }

  /**
   * Get all the available currencies from the API
   *
   * @returns   Promise<Currency[]>
   */
  @Command(LocalCommandIds.CLOUD_GET_CURRENCIES)
  @HandleCloudError
  public async getCurrencies(
    _request: LocalCommandRequest<LocalCommandIds.CLOUD_GET_CURRENCIES>,
  ): Promise<LocalCommandResponse<LocalCommandIds.CLOUD_GET_CURRENCIES>> {
    const response = await this._getAuthenticatedClient().currencyAPI.getCurrencies()
    return response.data
  }

  /**
   * Get the latest spot currency rates for the given base currency and list of currencies
   *
   * @param base        The base currency to get exchange rates for (i.e. USD)
   * @param currencies  The list of currencies to get exchange rates for (i.e. ['EUR', 'GBP'])
   * @returns           Promise<LatestCurrencyExchangeRates
   */
  @Command(LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES)
  @HandleCloudError
  public async getSpotCurrencyRates({
    currencies,
    base,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES>): LocalCommandResponse<LocalCommandIds.CLOUD_GET_SPOT_CURRENCY_RATES> {
    const response = await this._getAuthenticatedClient().currencyAPI.getCurrencyLatestRates(
      currencies,
      base,
    )
    return response.data
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
  @HandleCloudError
  public async getHistoricCurrencyRates({
    currency,
    startDate,
    endDate,
    base,
  }: LocalCommandRequest<LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES>): LocalCommandResponse<LocalCommandIds.CLOUD_GET_HISTORICAL_CURRENCY_RATES> {
    const response = await this._getAuthenticatedClient().currencyAPI.getCurrencyRates(
      currency,
      startDate,
      endDate,
      base,
    )
    return response.data
  }
}

// Export instance of Class
export const CloudService = new CloudServiceClass()
