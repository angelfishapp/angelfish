import { roundNumber } from './number-utils'

describe('test number-utils', () => {
  it('should round to 2 decimal places by default', () => {
    const result = roundNumber(123.456789)
    expect(result).toBe(123.46)
  })
  it('should round to 4 decimal places', () => {
    const result = roundNumber(123.456789, 4)
    expect(result).toBe(123.4568)
  })
  it('should round negative number to 3 decimal places', () => {
    const result = roundNumber(-123.456789, 3)
    expect(result).toBe(-123.457)
  })
  it('should round to integer', () => {
    const result = roundNumber(123.456789, 0)
    expect(result).toBe(123)
  })
})
