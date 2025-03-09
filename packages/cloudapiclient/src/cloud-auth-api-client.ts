import type {
  AuthenticationRequestOneOfProviderEnum,
  AuthenticationRequestOneOfResponse,
  TokenResponse,
} from './auth'
import { AuthApi, Configuration } from './auth'

/**
 * Provides API Client for Cloud Auuthentication APIs
 */
export class CloudAuthAPIs {
  // Base Auth API URL
  private basePath: string

  /**
   * Create new Auth API Client
   *
   * @param basePath  The base API URL to connect to. I.e. https://auth.angelfish.app
   */
  public constructor(basePath: string) {
    this.basePath = basePath
  }

  /**
   * Get an OOB Code for the given email
   *
   * @param email   The email address to send the OOB Code to
   * @returns       A new session ID to continue the authentication process
   */
  public async getOOBCode(email: string): Promise<string> {
    const oobResponse = await this.getAuthorizationAPI().getOOBCode({ email })
    return oobResponse.data.session_id
  }

  /**
   * Authenticate a user with the given provider and response
   *
   * @param provider    The provider to authenticate with ('oob_code')
   * @param session_id  The session ID from the getOOBCode method
   * @param response    The response object for the provider
   * @returns           The JWT Token and Refresh Token for the authenticated user
   */
  public async authenticate(
    provider: AuthenticationRequestOneOfProviderEnum,
    session_id: string,
    response: AuthenticationRequestOneOfResponse,
  ): Promise<TokenResponse> {
    const authResponse = await this.getAuthorizationAPI().authenticate({
      provider,
      session_id,
      response,
    })
    return {
      token: authResponse.data.token,
      refresh_token: authResponse.data.refresh_token,
    }
  }

  /**
   * Refresh the JWT Token for the authenticated user
   *
   * @param refresh_token The refresh token to use to get a new JWT Token
   * @returns             The new JWT Token and Refresh Token for the authenticated user
   */
  public async refreshToken(refresh_token: string): Promise<TokenResponse> {
    const refreshResponse = await this.getAuthorizationAPI().refreshToken({ refresh_token })
    return {
      token: refreshResponse.data.token,
      refresh_token: refreshResponse.data.refresh_token,
    }
  }

  /**
   * Helper method to log user out as logout requires authorization with JWT Token
   *
   * @param token The Base64 Encoded JWT Token for the current authenticated user
   */
  public async logout(token: string) {
    const config = new Configuration()
    config.accessToken = token
    await this.getAuthorizationAPI(config).logout()
  }

  /**
   * Get the Authorization API Client
   *
   * @param config The Auth Configuration to use for the API Client
   * @returns      The Auth API Client
   */
  private getAuthorizationAPI(config?: Configuration): AuthApi {
    const finalConfig = config ? config : new Configuration()
    finalConfig.basePath = this.basePath
    return new AuthApi(finalConfig)
  }
}
