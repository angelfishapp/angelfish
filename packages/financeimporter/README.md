# @angelfish/financeimporter

Provides library for importing banking file types. The library provides a consistent interface for each parser that returns an array of Accounts, Transactions and Categories as defined under the `./src/types` library, which makes importing data across file types much easier:

```TypeScript
/**
 * Output of a parser
 */
export interface ParsedData {
  /**
   * List of parsed accounts from data if available
   */
  accounts?: Account[]
  /**
   * List of parsed categories from data if available
   */
  categories?: Category[]
  /**
   * List of parsed transaction from data
   */
  transactions: Transaction[]
}
```

The goal of this library is only to import bank export files, it does not support exporting data to the file types or remote connections to servers (as other OFX libraries do), so the library can be kept small and simple enough to fix the inevitable issues that will be found across Banks that support poorly documented and old export formats.

## Import Qif Files

Uses the `QifParser` to parse Qif files using the specification [here](https://web.archive.org/web/20100222214101/http://web.intuit.com/support/quicken/docs/d_qif.html) as the source of truth. Original source code taken from [qif-ts](https://gitlab.com/cluskii/qif-ts/) module.

Currently only supports parsing of transactions from non-investment accounts. Will automatically parse dates as dd/mm/yy unless the file contains the mm/dd/yy format (inferred from any of the second part of the date being > 12 for any of the transactions).

Example Usage:

```TypeScript
import { QifParser } from '@angelfish/financeimporter/qif'

const fileData = readFileSync('./sample.qif').toString('utf-8')
const qif = new QifParser()
const data = await qif.parse(fileData)
```

## Import OFX/QFX Files

Uses the `OfxParser` which also supports Quicken's licensed QFX file type too. Inspiration from [Carbonate](https://github.com/bakesaled/carbonate). Tries
to adhere to the [OFX Data Exchange Specification](https://financialdataexchange.org/common/Uploaded%20files/OFX%20files/OFX%20Banking%20Specification%20v2.3.pdf).
This library is only for reading OFX/QFX files downloaded from a user's online banking. It does not support connecting to remote OFX banking APIs as those are being
phased out by many banks recently.

Currently only supports CREDITCARDMSGSRSV1 and BANKMSGSRSV1 statements. Other statement types will be added in future.

Example Usage:

```TypeScript
import { OfxParser } from '@angelfish/financeimporter/ofx'

const fileData = readFileSync('./sample.ofx').toString('utf-8')
const ofx = new OfxParser()
const data = await ofx.parse(fileData)
```

## Import CSV Files

Use the `CsvParser` to parse CSV files. As CSV files contain headers on the first row, provides an additional method to read all the available headers. These can then be
mapped using the `TransactionMapper` class which requires date, name and amount as a minimum to map transactions. If the file does not have these columns the import will fail.
Files are expected to have transactions for only one account per file.

Example Usage:

```TypeScript
import { CsvParser } from '@angelfish/financeimporter/csv'

const fileData = readFileSync('./sample.ofx').toString('utf-8')
const csv = new CsvParser()
// First get list of headers with sample values
const fileHeaders = csv.getHeaders(fileData)
// Parse rows to Transactions[]
const data = csv.parse(fileData, {
        fields: {
          date: 'date',
          name: 'description',
          amount: 'amount',
        },
        settings: {
          csv_delimiter: ',',
          date_format: 'MM DD YYYY',
        },
})
```

## Testing

This library also has samples for every file type taken from real exports for testing under each file type's `__testfiles__` directory. As many of the file specifications are poorly
documented and can be implemented differently across Banks, new test files should be added for testing when issues are found to ensure the library can import any Bank's export files.

To ensure the privacy of the original data, a `./scripts/obfuscate.ts` script is available which can be run using the command `yarn obfuscate -f <file-path>` which will replace all
Transaction names with random strings and overwrite the file. Currently CSV files and Account numbers need to be manually obfuscated.

To run tests you can run the following commands:

```bash
# Run all tests using Jest
yarn test

# Run only tests for OFX files
yarn test src/ofx
```

## Contributing

We welcome anyone who wants to fork and raise a PR back to this library with the following conditions:

1. Only financial export file types used by Banks/Institutions will be added to the library. If you want to export data from another source such as a personal finance app you will need to create another library (but you are welcome to import this library to use the Types/Utils if needed)
1. Any new file type Parsers must implement the Parser interface so data is exported consistently across file types
1. If you are fixing an issue with a specific export file, please add that file to the `__testfiles__` and add a new test. You can use the obfuscate script to obfuscate private data before adding the file to the repo
1. All tests need to be passing before a PR will be accepted
1. Please keep PRs small and focused so they're easier to review and merge
1. This library is licensed under MIT, and any contributions will be accepted under that license
