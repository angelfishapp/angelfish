import { readFileSync } from 'fs'
import * as path from 'path'

import { CSVParser } from './csv-parser'

const TEST_FILES_DIR = path.resolve(__dirname, '__testfiles__')

describe('deserializeCSV()', () => {
  it('parse-headers-with-quotes', async () => {
    const csvString = 'Name, "Occupation, Not Separated", Age\nJohn, Software Developer, 30'
    const csv = new CSVParser()
    expect(csv.getHeaders(csvString)).toMatchSnapshot()
  })

  it('parse-csv-file-headers', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/statement.csv').toString('utf-8')
    const csv = new CSVParser()

    expect(csv.getHeaders(file)).toMatchSnapshot()
  })

  it('parse-csv-file', async () => {
    const file = readFileSync(TEST_FILES_DIR + '/statement.csv').toString('utf-8')
    const csv = new CSVParser()

    expect(
      await csv.parse(file, {
        fields: {
          date: 'Posting Date',
          amount: 'Amount',
          name: 'Description',
          check_number: 'Check or Slip #',
        },
        settings: {
          csv_delimiter: ',',
          date_format: 'MM DD YYYY',
        },
      }),
    ).toMatchSnapshot()
  })
})
