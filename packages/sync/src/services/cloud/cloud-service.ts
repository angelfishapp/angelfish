import type { TokenResponse } from '@angelfish/cloudapiclient'
import {
  CloudAuthAPIs,
  CloudV1APIs,
  JWTAuthHelper,
  UnauthorizedError,
  convertCloudUserProfile,
} from '@angelfish/cloudapiclient'
import type { IAuthenticatedUser, IAuthenticationState } from '@angelfish/core'
import { AppCommands, Command, CommandsClient, Logger } from '@angelfish/core'
import { HandleCloudError } from './cloud-service-utils'

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

  /**
   * Initialise the API Client with authentication tokens. This is called from the AuthService
   * when initialised or new user is authenticated into App.
   */
  @Command('_api.auth.init')
  @HandleCloudError
  public async initialiseAPIClient(payload: { refreshToken: string }): Promise<void> {
    if (!payload.refreshToken) {
      throw new Error('No refresh token provided to initialise API Client')
    }

    // Get a new JWT Token and set the V1 API Client
    const tokenResponse = await this._refreshToken(payload.refreshToken)

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
  @Command('_api.auth.get.oob.code')
  @HandleCloudError
  public async sendOOBCode(payload: { email: string }): Promise<string> {
    const session_id = await this._authAPI.getOOBCode(payload.email)
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
  @Command('_api.auth.authenticate')
  @HandleCloudError
  public async authenticate(payload: {
    session_id: string
    oob_code: string
  }): Promise<TokenResponse> {
    const tokenResponse = await this._authAPI.authenticate('oob_code', payload.session_id, {
      oob_code: payload.oob_code,
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
    await CommandsClient.executeCommand<void>(AppCommands.SET_AUTHENTICATION_SETTINGS, {
      refreshToken: tokenResponse.refresh_token,
    } as IAuthenticationState)
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
  @Command('_api.auth.logout')
  @HandleCloudError
  public async logout(token: string): Promise<void> {
    await this._authAPI.logout(token)
  }

  /**
   * Get the current authenticated user profile
   *
   * @returns   The current authenticated user profile
   * @throws    UnauthorizedError if not authenticated
   */
  @Command('_api.get.user.profile')
  @HandleCloudError
  public async getUserProfile(_payload: undefined): Promise<IAuthenticatedUser> {
    const userProfile = await this._getAuthenticatedClient().userAPI.getUser()
    return convertCloudUserProfile(userProfile.data)
  }
}

// Export instance of Class
export const CloudService = new CloudServiceClass()
