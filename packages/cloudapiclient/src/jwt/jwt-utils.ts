import type { TokenResponse } from '../auth'

/**
 * Interface for the JWT payload from Angelfish Auth APIs
 */
export interface JWTPayload {
  // The audience domain of the token (who the token is intended for), i.e. angelfish.dev
  aud: string
  // The issuer of the token (who issued the token), i.e. https://auth.angelfish.dev
  iss: string
  // The subject of the token (who the token is about), i.e. the user ID
  sub: string
  // The user's email address
  email: string
  // The token expiration time in seconds since the Unix epoch
  exp: number
}

/**
 * Helper class to manage JWT authentication for Angelfish API Client Libraries.
 */
export class JWTAuthHelper {
  // The current JWT token
  private _token: string
  // The expiry time of the current JWT token
  private _tokenExpirary: number = 0
  // The refresh token to get a new JWT token if expired
  private _refreshToken: string
  // The function to refresh the token
  private _refreshTokenFn: (refresh_token: string) => Promise<TokenResponse>

  /**
   * Constructor for the JWTAuth class.
   *
   * @param token         The current JWT token
   * @param refresh_token The refresh token to get a new JWT token if expired
   * @param refreshFn     The function to refresh the token
   */
  public constructor(
    token: string,
    refresh_token: string,
    refreshFn: (refresh_token: string) => Promise<TokenResponse>,
  ) {
    this._token = token
    this._refreshToken = refresh_token
    this._refreshTokenFn = refreshFn

    // Decode the JWT token to get the expiry time
    if (token) {
      const decodedPayload = JWTAuthHelper.decodeJwtPayload(token)
      if (decodedPayload) {
        this._tokenExpirary = decodedPayload.exp * 1000
      }
    } else {
      this._tokenExpirary = new Date().getTime()
    }
  }

  /**
   * Get the current JWT token.
   *
   * @returns The current JWT token
   */
  public get token(): string {
    return this._token
  }

  /**
   * Get the Unix Epoch expiry time of the current JWT token.
   *
   * @returns The expiry time of the current JWT token
   */
  public get tokenExpiry(): number {
    return this._tokenExpirary
  }

  /**
   * Get the refresh token. If the JWT token is expired, a new token will be generated using the refresh token.
   * This function is passed into the client library to get the JWT token when making API requests.
   *
   * @returns The refresh token
   */
  public async refreshToken(_name?: string, _scopes?: string[]): Promise<string> {
    // If no token or over expiry time, generate new token
    if (!this.token || new Date().getTime() > this.tokenExpiry) {
      const tokenResponse = await this._refreshTokenFn(this._refreshToken)
      if (tokenResponse.token) {
        const decodedPayload = JWTAuthHelper.decodeJwtPayload(tokenResponse.token)
        if (decodedPayload) {
          this._tokenExpirary = decodedPayload.exp * 1000
        }
      } else {
        this._tokenExpirary = new Date().getTime()
      }
      this._token = tokenResponse.token
      this._refreshToken = tokenResponse.refresh_token
    }

    return this._token
  }

  /**
   * Helper function to decode a Base64-encoded JWT payload.
   *
   * @param token The Base64-encoded JWT token
   * @returns     The decoded JWT payload
   * @throws      If the token structure is invalid
   */
  public static decodeJwtPayload(token: string): JWTPayload {
    // Split the JWT into its parts: header, payload, and signature
    const [, payload] = token.split('.')

    if (!payload) {
      throw new Error('Invalid token structure.')
    }

    // Decode the base64 payload
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
    return decodedPayload
  }
}
