import type { AppCommandRequest, AppCommandResponse, IAuthenticatedUser } from '@angelfish/core'
import { AppCommandIds, AppEventIds, Command, CommandsClient, Logger } from '@angelfish/core'
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
   * Initialise AuthService. If refreshToken provided, will use existing Refresh token to start service,
   * (useful for testing).
   *
   * Otherwise will try and load any locally stored refresh tokens in settings file on disk,
   * and checking if it is still valid. If not will clear local settings, but if valid will initialised service to
   * authenticated state with currentUser/isAuthenticated set
   */
  public async init(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        logger.debug('Using existing JWT Bearer Token to authenticate user', refreshToken)
        // Initialise the API Client with the new refresh token
        await executeLocalCommand(LocalCommandIds.INIT_API_CLIENT, {
          refreshToken,
        })
        this._isAuthenticated = true
      } catch (error) {
        logger.error('Error Initialising AuthService:', error)
      }
      return
    }

    // Get the current authentication state from settings file on disk
    const authState = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_AUTHENTICATION_SETTINGS,
    )
    if (authState && authState.refreshToken) {
      try {
        // Initialise the API Client with the new refresh token
        await executeLocalCommand(LocalCommandIds.INIT_API_CLIENT, {
          refreshToken: authState.refreshToken,
        })
      } catch (error) {
        logger.error('Error Initialising API Client with refresh token:', error)
      }
    }

    logger.info(
      `Successfully Initialised AuthService: isAuthenticated=${this._isAuthenticated}, authenticatedUser=${authState?.authenticatedUser?.id}`,
    )
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
    CommandsClient.emitAppEvent(AppEventIds.ON_LOGIN, { authenticatedUser: userProfile })

    return userProfile
  }

  /**
   * Logs a user out of the Cloud APIs by removing their refresh token
   * stored locally so they can't refresh and get a valid JWT token
   */
  @Command(AppCommandIds.AUTH_LOGOUT)
  public async logout(
    _request: AppCommandRequest<AppCommandIds.AUTH_LOGOUT>,
  ): AppCommandResponse<AppCommandIds.AUTH_LOGOUT> {
    // Log user out of Cloud APIs and remove local settings
    await executeLocalCommand(LocalCommandIds.CLOUD_API_LOGOUT)
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      authenticatedUser: null,
      refreshToken: null,
    })
    this._isAuthenticated = false

    // Notify App that user is logged out
    CommandsClient.emitAppEvent(AppEventIds.ON_LOGOUT)
  }

  /**
   * Get the current authenticated user profile logged into the app
   */
  @Command(AppCommandIds.GET_AUTHETICATED_USER)
  public async getAuthenticatedUser(
    _request: AppCommandRequest<AppCommandIds.GET_AUTHETICATED_USER>,
  ): AppCommandResponse<AppCommandIds.GET_AUTHETICATED_USER> {
    const authState = await CommandsClient.executeAppCommand(
      AppCommandIds.GET_AUTHENTICATION_SETTINGS,
    )
    return authState.authenticatedUser as IAuthenticatedUser | null
  }
  /**
   * Update the authenticated user profile with the given payload
   *
   * @param request   The user profile to update
   */
  @Command(AppCommandIds.UPDATE_AUTHENTICATED_USER)
  public async updateAuthenticatedUser(
    request: AppCommandRequest<AppCommandIds.UPDATE_AUTHENTICATED_USER>,
  ): AppCommandResponse<AppCommandIds.UPDATE_AUTHENTICATED_USER> {
    const updatedUser = await executeLocalCommand(
      LocalCommandIds.CLOUD_API_UPDATE_USER_PROFILE,
      request,
    )
    await CommandsClient.executeAppCommand(AppCommandIds.SET_AUTHENTICATION_SETTINGS, {
      authenticatedUser: updatedUser,
    })

    return updatedUser
  }
}

// Export instance of Class
export const AuthService = new AuthServiceClass()
