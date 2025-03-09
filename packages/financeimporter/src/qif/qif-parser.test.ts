import { readFileSync } from 'fs'
import * as path from 'path'

import { QifParser } from './qif-parser'
import type { QifData, QifTransaction } from './qif-parser-types'
import { QifType } from './qif-parser-types'

const TEST_FILES_DIR = path.resolve(__dirname, '__testfiles__')

const qifParser = new QifParser()

describe('deserializeQIF()', () => {
  it('should parse type correctly', () => {
    const qif: string = `!Type:Bank
    ^`

    const output = qifParser.parseQifSection(qif)

    expect(output.type).toEqual(QifType.Bank)
    if (output.type === QifType.Bank) {
      expect(output.transactions).toEqual([])
    }
  })

  it('should handle empty string', () => {
    const qif: string = ``

    expect(() => qifParser.parseQifSection(qif)).toThrow('No valid QIF content found.')
  })

  it('should throw an error on unsupported type', () => {
    const qif: string = `!Type:Memorized
    ^`

    expect(() => qifParser.parseQifSection(qif)).toThrow(
      'Qif File Type not supported: !Type:Memorized',
    )
  })

  describe('investment accounts', () => {
    it('should parse all investment fields correctly', () => {
      const qif: string = `!Type:Invst
D18/02/1992
NBuy
YAAPL
I12.35
Q100
T1300
Ccleared
PSell at 100
MBuying Apple Cheap
O65
LabcdeAccount
$1300
^`

      const output = qifParser.parseQifSection(qif)

      expect(output.type).toEqual(QifType.Investment)
      if (output.type === QifType.Investment) {
        expect(output.transactions.length).toEqual(1)

        expect(output.transactions[0].date).toEqual('18/02/1992')
        expect(output.transactions[0].investmentAction).toEqual('Buy')
        expect(output.transactions[0].investmentSecurity).toEqual('AAPL')
        expect(output.transactions[0].investmentPrice).toEqual(12.35)
        expect(output.transactions[0].investmentQuantity).toEqual(100)
        expect(output.transactions[0].amount).toEqual(1300)
        expect(output.transactions[0].clearedStatus).toEqual('cleared')
        expect(output.transactions[0].investmentReminder).toEqual('Sell at 100')
        expect(output.transactions[0].memo).toEqual('Buying Apple Cheap')
        expect(output.transactions[0].investmentComission).toEqual(65)
        expect(output.transactions[0].investmentAccount).toEqual('abcdeAccount')
        expect(output.transactions[0].investmentAmountTransferred).toEqual(1300)
      }
    })

    it('should throw error on bad detail item', () => {
      const qif: string = `!Type:Invst
D18/02/1992
NBuy
YAAPL
XBroken_Detail_Item
$1300
^`

      expect(() => qifParser.parseQifSection(qif)).toThrow(
        'Did not recognise detail item for line: XBroken_Detail_Item',
      )
    })
  })

  describe('non investment accounts', () => {
    it('should parse all noninvestment fields correctly', () => {
      const qif: string = `!Type:Bank
D18/02/1992
T100
Ccleared
NA1234
PGordon Coffee
MCoffee for the month
A103
AGordon Street
ALondon
LGroceries
^`

      const output = qifParser.parseQifSection(qif)

      expect(output.type).toEqual(QifType.Bank)
      if (output.type === QifType.Bank) {
        expect(output.transactions.length).toEqual(1)

        expect(output.transactions[0].date).toEqual('18/02/1992')
        expect(output.transactions[0].amount).toEqual(100)
        expect(output.transactions[0].clearedStatus).toEqual('cleared')
        expect(output.transactions[0].reference).toEqual('A1234')
        expect(output.transactions[0].payee).toEqual('Gordon Coffee')
        expect(output.transactions[0].memo).toEqual('Coffee for the month')
        expect(output.transactions[0].address).toEqual(['103', 'Gordon Street', 'London'])
        expect(output.transactions[0].category).toEqual('Groceries')
      }
    })

    it('should throw error on bad detail item', () => {
      const qif: string = `!Type:Bank
D18/02/1992
XBroken_Detail_Item
^`

      expect(() => qifParser.parseQifSection(qif)).toThrow(
        'Did not recognise detail item for line: XBroken_Detail_Item',
      )
    })

    it('should parse splits transactions correctly', () => {
      const qif: string = `!Type:Bank
      D12/09/2019
      T350
      PAmazon
      SGroceries
      EFood
      $125
      SMedicine
      EMedical Supplies
      $225
      A123 Amazon Way
      ^`
      const output: QifData = qifParser.parseQifSection(qif)

      expect(output.type).toEqual(QifType.Bank)
      if (output.type === QifType.Bank) {
        if (output.transactions[0] !== undefined) {
          const outputTransaction: QifTransaction = output.transactions[0]
          expect(outputTransaction.date).toEqual('12/09/2019')

          // Check that the splits are correct
          expect(outputTransaction.splits).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                category: 'Groceries',
                memo: 'Food',
                amount: 125,
              }),
              expect.objectContaining({
                category: 'Medicine',
                memo: 'Medical Supplies',
                amount: 225,
              }),
            ]),
          )
        } else {
          expect(output.transactions.length).toEqual(1)
        }
      }
    })
  })

  describe('test files', () => {
    it('should parse statement1_us.qif correctly', async () => {
      const file = readFileSync(TEST_FILES_DIR + '/statement1_us.qif').toString('utf-8')
      expect(await qifParser.parse(file)).toMatchSnapshot()
    })

    it('should parse statement2_uk.qif correctly', async () => {
      const file = readFileSync(TEST_FILES_DIR + '/statement2_uk.qif').toString('utf-8')
      expect(await qifParser.parse(file)).toMatchSnapshot()
    })

    it('should parse banktivity_export.qif correctly', async () => {
      const file = readFileSync(TEST_FILES_DIR + '/banktivity_export.qif').toString('utf-8')
      expect(await qifParser.parse(file)).toMatchSnapshot()
    })
  })
})
