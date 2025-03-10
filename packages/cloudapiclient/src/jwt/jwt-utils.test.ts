import { TestLogger } from '@angelfish/tests'
import { JWTAuthHelper } from '.'

/**
 * Test JWT Utils
 */
describe('Test JWT Utils', () => {
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbmdlbGZpc2guYXBwIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmFuZ2VsZmlzaC5hcHAiLCJzdWIiOiI0MzQ4NTNiMy00YzcwLTRhOGEtYmY5NS0xYzhkNTEwZTA0N2MiLCJlbWFpbCI6InRlc3RAYW5nZWxmaXNoLmFwcCIsImV4cCI6MTczNjgwMDEyOX0.Ol0iEN9PImdc1ejpvz-arS6ly2NSN-zV7EHAc54VJhMwcNm_8JJZQBDpuhz2r7rooKmo9oysEqEexE7DzvhnnKgTsr2A6qEV4PdsFCFn3DT9wvzLKGiVCpYWgAC4Gfi3g7WR8wCVgBjeDxy_f2-8Y8Vl3jXdcxeQVQDHIxVdqHgbWNaGXra9rdC2_679y6LApAUwIKeUI-WUsLy4JMffhl_B7sLYbmPqYgMFpixLfZqdHbYkSU6vZKN3CMKqcnbi7R7G6cBSFp-kvYhdDpB0SSezSJFIK5FxwUngMcX21FG5IDD9WzzbqnszmS8NYD2UJQsQEX9Nkwgw9rJeaID3Kg'

  it('decode JWT payload', () => {
    const decodedPayload = JWTAuthHelper.decodeJwtPayload(token)
    TestLogger.log('Decoded Payload:', decodedPayload)
    expect(decodedPayload).toBeDefined()
    expect(decodedPayload.aud).toBe('angelfish.app')
    expect(decodedPayload.iss).toBe('https://auth.angelfish.app')
    expect(decodedPayload.sub).toBe('434853b3-4c70-4a8a-bf95-1c8d510e047c')
    expect(decodedPayload.email).toBe('test@angelfish.app')
    expect(decodedPayload.exp).toBe(1736800129)
  })
})
