import * as fs from 'fs'
import * as path from 'path'

import {
  allCountries,
  getCountryFromCode,
  getDialCodeLookupArray,
  inferCountryFromPhone,
} from './countries'
import { allCurrencies } from './currencies'

const FLAGS_DIR = path.resolve(__dirname, '../../../frontend/resources/assets/svg/flags')

test('test Has Valid Currency', () => {
  for (const country of allCountries) {
    let currencyExists = false
    for (const currency of allCurrencies) {
      if (country.currency == currency.code) {
        currencyExists = true
        break
      }
    }
    if (!currencyExists) {
      throw Error(`No Currency Exists for Country ${country.name}, currency=${country.currency}`)
    }
  }
})

test('test Has Flag SVGs', () => {
  // Check Square SVGs
  const squareDIR = FLAGS_DIR + '/1x1/'
  // eslint-disable-next-line no-console
  console.log('Checking squareDIR', squareDIR)
  for (const country of allCountries) {
    const flagName = country.code + '.svg'
    const exists = fs.existsSync(squareDIR + flagName)
    if (!exists) {
      throw Error(`Flag ${flagName} does not exist for Country ${country.name}`)
    }
  }
  for (const currency of allCurrencies) {
    const flagName = currency.flag + '.svg'
    const exists = fs.existsSync(squareDIR + flagName)
    if (!exists) {
      throw Error(`Flag ${flagName} does not exist for Currency ${currency.name}`)
    }
  }

  // Check Fullsize SVGs
  const fullsizeDIR = FLAGS_DIR + '/4x3/'
  // eslint-disable-next-line no-console
  console.log('Checking fullsizeDIR', fullsizeDIR)
  for (const country of allCountries) {
    const flagName = country.code + '.svg'
    const exists = fs.existsSync(fullsizeDIR + flagName)
    if (!exists) {
      throw Error(`Flag ${flagName} does not exist for Country ${country.name}`)
    }
  }
  for (const currency of allCurrencies) {
    const flagName = currency.flag + '.svg'
    const exists = fs.existsSync(fullsizeDIR + flagName)
    if (!exists) {
      throw Error(`Flag ${flagName} does not exist for Currency ${currency.name}`)
    }
  }
})

test('test getCountryFromCode()', () => {
  expect(getCountryFromCode('ca')?.name).toEqual('Canada')
  expect(getCountryFromCode('XXX')).toBeNull()
})

test('test getDialCodeMap() throws no exceptions', () => {
  const dialCodeLookupArray = getDialCodeLookupArray()
  expect(dialCodeLookupArray.length).toBeGreaterThan(1)
})

test('test inferCountryFromPhone()', () => {
  const dialCodeLookupArray = getDialCodeLookupArray()

  // Try US Number First
  let country = inferCountryFromPhone('+1415223223', dialCodeLookupArray)
  expect(country?.code).toEqual('US')

  // Then Canadian
  country = inferCountryFromPhone('+1437223223', dialCodeLookupArray)
  expect(country?.code).toEqual('CA')

  // Then British Virgin Islands
  country = inferCountryFromPhone('+1284223223', dialCodeLookupArray)
  expect(country?.code).toEqual('VG')

  // Simulate Typing
  country = inferCountryFromPhone('+1', dialCodeLookupArray)
  expect(country?.code).toEqual('US')
  country = inferCountryFromPhone('+14', dialCodeLookupArray)
  expect(country?.code).toEqual('US')
  country = inferCountryFromPhone('+143', dialCodeLookupArray)
  expect(country?.code).toEqual('US')
  country = inferCountryFromPhone('+1437', dialCodeLookupArray)
  expect(country?.code).toEqual('CA')

  // Try Invalid Number
  country = inferCountryFromPhone('+999', dialCodeLookupArray)
  expect(country).toBeNull()
})
