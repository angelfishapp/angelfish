import { UserApi } from './auth'
import { Configuration, CurrenciesApi, InstitutionsApi } from './v1'

/**
 * Provides authenticated API Client for V1 APIs
 * Note: The auth /user APIs are moved under this class as they require authentication so added here for
 * convenience
 */
export class CloudV1APIs {
  // APIs
  public currencyAPI: CurrenciesApi
  public institutionAPI: InstitutionsApi
  public userAPI: UserApi

  /**
   * Create new API Client
   *
   * @param apiBasePath             The base API URL to connect to. I.e. https://api.angelfish.app
   * @param authBasePath            The base Auth URL to connect to. I.e. https://auth.angelfish.app
   * @param refresh_jwt_token       Function to get and regenerate a valid JWT Bearer Token
   */
  public constructor(
    apiBasePath: string,
    authBasePath: string,
    refresh_jwt_token: (name?: string, scopes?: string[]) => Promise<string>,
  ) {
    // Configure Authentication
    const apiConfig = new Configuration()
    apiConfig.accessToken = refresh_jwt_token
    apiConfig.basePath = apiBasePath

    this.currencyAPI = new CurrenciesApi(apiConfig)
    this.institutionAPI = new InstitutionsApi(apiConfig)

    // Configure User API at authBasePath
    const authConfig = new Configuration()
    authConfig.accessToken = refresh_jwt_token
    authConfig.basePath = authBasePath
    this.userAPI = new UserApi(authConfig)
  }
}
