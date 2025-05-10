import { TestLogger } from '@angelfish/tests'
import { generateCSPHeader } from './csp'

describe('Content Security Policy Utils', () => {
  it('should generate a CSP header with default values', () => {
    const devCspHeader = generateCSPHeader('development')
    TestLogger.log('devCspHeader', devCspHeader)
    expect(devCspHeader).toContain(
      "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data:",
    )

    const prodCspHeader = generateCSPHeader('production')
    TestLogger.log('prodCspHeader', prodCspHeader)
    expect(prodCspHeader).toContain(
      "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:",
    )
  })

  it('should generate a CSP header with custom directives', () => {
    const customCspHeader = generateCSPHeader('development', {
      'img-src': ['https://example.com'],
      'connect-src': ['https://api.example.com'],
    })
    TestLogger.log('customCspHeader', customCspHeader)
    expect(customCspHeader).toContain(
      "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: https://example.com; connect-src https://api.example.com 'self'",
    )
  })

  it('should generate a CSP header for process window', () => {
    const processCspHeader = generateCSPHeader('development', {
      'connect-src': ['https://api.angelfish.app', 'https://auth.angelfish.app'],
    })
    TestLogger.log('processCspHeader', processCspHeader)
    expect(processCspHeader).toContain(
      "default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data:; connect-src https://api.angelfish.app https://auth.angelfish.app 'self'",
    )
  })
})
