import { readFileSync } from 'fs'
import * as path from 'path'

import { OfxParser } from './ofx-parser'
import { parseOFXDate } from './ofx-parser-utils'

const TEST_FILES_DIR = path.resolve(__dirname, '__testfiles__')

describe('OFX Parser', () => {
  it('OFX-date-parser-works', async () => {
    // Without any timezone offset
    let date = parseOFXDate('20190810120000')
    expect(date).toEqual(new Date('2019-08-10T12:00:00Z'))
    // Try with simple offset
    date = parseOFXDate('20190810120000.000[+1]')
    expect(date).toEqual(new Date('2019-08-10T12:00:00+01:00'))
    // Try with offset with minutes
    date = parseOFXDate('20190810120000.000[+01.50]')
    expect(date).toEqual(new Date('2019-08-10T12:00:00+01:30'))
    // Try with 2 digit offset
    date = parseOFXDate('20190810120000.000[-10]')
    expect(date).toEqual(new Date('2019-08-10T12:00:00-10:00'))
    // Try with timezone name in offset
    date = parseOFXDate('20201015110000.000[-7:PDT]')
    expect(date).toEqual(new Date('2020-10-15T11:00:00-07:00'))
    // Try with 0 offset
    date = parseOFXDate('20201015110000.000[0:GMT]')
    expect(date).toEqual(new Date('2020-10-15T11:00:00Z'))
  })

  it('parse-OFX-file creditcard.ofx', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/creditcard.ofx').toString('utf-8')
    const ofx = new OfxParser()

    expect(await ofx.parse(file)).toMatchSnapshot()
  })

  it('parse-OFX-file bankaccount.ofx', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/bankaccount.ofx').toString('utf-8')
    const ofx = new OfxParser()

    expect(await ofx.parse(file)).toMatchSnapshot()
  })

  it('parse-QFX-file creditcard.qfx', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/creditcard.qfx').toString('utf-8')
    const ofx = new OfxParser()

    expect(await ofx.parse(file)).toMatchSnapshot()
  })

  it('parse-QFX-bank-file bankaccount.qfx', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/bankaccount.qfx').toString('utf-8')
    const ofx = new OfxParser()

    expect(await ofx.parse(file)).toMatchSnapshot()
  })
})
