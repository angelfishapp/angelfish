import type { AppCommandRequest, AppCommandResponse, IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, AppEvents, Command, CommandsClient, Logger } from '@angelfish/core'
import { LocalCommandIds, executeLocalCommand } from '../../local-commands'

const logger = Logger.scope('AuthService')

/**
 * Service to manage authentication with the Cloud APIs and provide commands to login and logout
 * user. Relies on commands from CloudService to call CloudAPIs, and Main process to set/get persisted
 * authentication data from disk.
 */
class AuthServiceClass {
  // Is app currently authenticated with Cloud APIs (@default false)
  private _isAuthenticated: boolean = false
  // Session ID during OOB Code flow
  private _current_session_id?: string = undefined

  /**
   * Initialize the AuthService. Checks to see if user is authenticated and sets the
   * state accordingly
   */
  public async init(): Promise<void> {
    const authState = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_AUTHENTICATION_SETTINGS,
    )

    logger.info('AuthService initialized with authentication state', authState)
  }

  /**
   * Get an Out-Of-Band (OOB) Code for the given email
   *
   * @param email   The email address to send the OOB Code to
   */
  @Command(AppCommandIds.AUTH_SEND_OOB_CODE)
  public async sendOOBCode(
    request: AppCommandRequest<AppCommandIds.AUTH_SEND_OOB_CODE>,
  ): AppCommandResponse<AppCommandIds.AUTH_SEND_OOB_CODE> {
    if (this._isAuthenticated) {
      // Logout existing user if currently authenticated
      await this.logout()
    }
    const session_id = await executeLocalCommand(LocalCommandIds.CLOUD_API_SEND_OOB_CODE, request)
    this._current_session_id = session_id
    logger.debug(
      `Successfully sent OOB Code to email ${request.email} and started session with id ${session_id}`,
    )
  }

  /**
   * Authenticate a user with an OOB Code sent to their email
   *
   * @param oob_code    The OOB Code sent to the user's email
   */
  @Command(AppCommandIds.AUTH_AUTHENTICATE)
  public async authenticate(
    request: AppCommandRequest<AppCommandIds.AUTH_AUTHENTICATE>,
  ): AppCommandResponse<AppCommandIds.AUTH_AUTHENTICATE> {
    if (!this._current_session_id) {
      throw new Error(
        `No current session_id set. Must call '${AppCommandIds.AUTH_SEND_OOB_CODE}' first.`,
      )
    }

    const tokenResponse = await executeLocalCommand(LocalCommandIds.CLOUD_API_AUTHENTICATE, {
      session_id: this._current_session_id,
      oob_code: request.oob_code,
    })
    logger.debug('Successfully authenticated user with OOB Code')

    // Initialise the API Client with the new refresh token
    await executeLocalCommand(LocalCommandIds.INIT_API_CLIENT, {
      refreshToken: tokenResponse.refresh_token,
    })

    // Get the authenticated user profile save authentication settings via main process
    const userProfile = await executeLocalCommand(LocalCommandIds.CLOUD_API_GET_USER_PROFILE)
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      authenticatedUser: userProfile,
      refreshToken: tokenResponse.refresh_token,
    })

    // Set service state
    this._isAuthenticated = true
    this._current_session_id = undefined

    // Notify App that user is logged in
    CommandsClient.emitEvent(AppEvents.ON_LOGIN, { book: null })

    return userProfile
  }

  /**
   * Logs a user out of the Cloud APIs by removing their refresh token
   * stored locally so they can't refresh and get a valid JWT token
   */
  @Command(AppCommandIds.AUTH_LOGOUT)
  public async logout(
    _r: AppCommandRequest<AppCommandIds.AUTH_LOGOUT>,
  ): AppCommandResponse<AppCommandIds.AUTH_LOGOUT> {
    // Log user out of Cloud APIs and remove local settings
    await executeLocalCommand(LocalCommandIds.CLOUD_API_LOGOUT)
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      authenticatedUser: null,
      refreshToken: null,
    })
    this._isAuthenticated = false

    // Notify App that user is logged out
    CommandsClient.emitEvent(AppEvents.ON_LOGOUT)
  }

  /**
   * Get the current authenticated user profile logged into the app
   */
  @Command(AppCommandIds.GET_AUTNETICATED_USER)
  public async getAuthenticatedUser(
    _r: AppCommandRequest<AppCommandIds.GET_AUTNETICATED_USER>,
  ): AppCommandResponse<AppCommandIds.GET_AUTNETICATED_USER> {
    const authState = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_AUTHENTICATION_SETTINGS,
    )
    return authState.authenticatedUser as IAuthenticatedUser | null
  }
  /**
   * Update the authenticated user profile with the given payload
   *
   * @param payload   The user profile to update
   */
  @Command(AppCommandIds.UPDATE_AUTHENTICATED_USER)
  public async updateAuthenticatedUser(payload: IAuthenticatedUser): Promise<void> {
    await executeLocalCommand(LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE, payload)
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      authenticatedUser: payload,
    })
  }
}

// Export instance of Class
export const AuthService = new AuthServiceClass()
