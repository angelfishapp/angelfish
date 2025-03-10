import { TestLogger } from '@angelfish/tests'
import { CloudAuthAPIs, CloudV1APIs, JWTAuthHelper } from '.'

const AUTH_BASE_URL = 'https://auth.angelfish.app'
const API_BASE_URL = 'https://api.angelfish.app'

// Hold the JWT Token for the authenticated user
let token: string
// Hold the Refresh Token for the authenticated user
let refresh_token: string

/**
 * Test CloudAuthAPIs Client
 */
describe('Test CloudAuthAPIs', () => {
  let client: CloudAuthAPIs
  let session_id: string

  beforeAll(() => {
    client = new CloudAuthAPIs(AUTH_BASE_URL)
  })

  it('send oob code', async () => {
    const new_session_id = await client.getOOBCode('test@angelfish.app')
    expect(new_session_id).toBeDefined()
    session_id = new_session_id
    TestLogger.log('Session ID:', session_id)
  })

  it('authenticate oob code', async () => {
    const tokenResponse = await client.authenticate('oob_code', session_id, { oob_code: '123456' })
    expect(tokenResponse.token).toBeDefined()
    expect(tokenResponse.refresh_token).toBeDefined()
    token = tokenResponse.token
    refresh_token = tokenResponse.refresh_token

    TestLogger.log('Token:', token)
    TestLogger.log('Refresh Token:', refresh_token)
  })

  it('logout user', async () => {
    await client.logout(token)
  })
})

/**
 * Test CloudV1APIs Client
 * JWT Token will not expire for 1hr so logging out above will not affect this test
 */
describe('Test CloudV1APIs', () => {
  let client: CloudV1APIs

  beforeAll(() => {
    const jwtAuthHelper = new JWTAuthHelper(token, refresh_token, async () => {
      TestLogger.log('Refreshing V1 Client JWT Token')
      return {
        token,
        refresh_token,
      }
    })

    client = new CloudV1APIs(
      API_BASE_URL,
      AUTH_BASE_URL,
      jwtAuthHelper.refreshToken.bind(jwtAuthHelper),
    )
  })

  it('get user profile', async () => {
    const userProfileResponse = await client.userAPI.getUser()
    expect(userProfileResponse.status).toBe(200)
  })

  it('get currencies', async () => {
    const currenciesResponse = await client.currencyAPI.getCurrencies()
    expect(currenciesResponse.status).toBe(200)
  })
})
