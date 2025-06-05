import moment from 'moment'

import type { ImportTransactionsMapper, ReconciledTransaction } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/**
 * Open file and get any mappings from the file for the next step
 *
 * @param file          File path to open
 * @param delimiter     The delimiter used in the file if CSV
 * @returns             ParsedFileMappings object
 */
export async function getFileMappings(file: string, delimiter?: string) {
  return await CommandsClient.executeAppCommand(AppCommandIds.IMPORT_MAPPINGS, {
    filePath: file,
    delimiter,
  })
}

/**
 * Open file and reconcile transactions with the mappings
 *
 * @param file      File path to open
 * @param mapper    The mappings to use to reconcile the transactions
 * @returns         Array of reconciled transactions
 */
export async function reconcileTransactions(file: string, mapper: ImportTransactionsMapper) {
  const reconciledTransactions: ReconciledTransaction[] = await CommandsClient.executeAppCommand(
    AppCommandIds.IMPORT_FILE,
    {
      filePath: file,
      mapper,
    },
  )
  // Ensure Dates are converted to Date objects
  reconciledTransactions.forEach((t) => {
    t.date = moment(t.date).toDate()
    t.created_on = moment(t.created_on).toDate()
    t.modified_on = moment(t.modified_on).toDate()
  })
  return reconciledTransactions
}

/**
 * Import reviewed reconciled transactions into the database
 *
 * @param transactions The list of reconciled transactions to import
 */
export async function importTransactions(transactions: ReconciledTransaction[]) {
  await CommandsClient.executeAppCommand(AppCommandIds.IMPORT_TRANSACTIONS, {
    reconciledTransactions: transactions,
  })
}
