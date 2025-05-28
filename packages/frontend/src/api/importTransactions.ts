import moment from 'moment'

import type { ImportTransactionsMapper, ReconciledTransaction } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'

/** ************************************************************************************************
 * IPC Callback Functions
 *************************************************************************************************/

/**
 * Open the Electron File Open Dialog to select import file
 *
 * @param multiple      Whether to allow multiple files to be selected
 * @param fileTypes     Array of file types to filter by
 * @returns             Path to selected file or null if none selected
 */
export async function onOpenFileDialog(multiple: boolean, fileTypes?: string[]) {
  const filePath = await CommandsClient.executeAppCommand(AppCommandIds.SHOW_OPEN_FILE_DIALOG, {
    title: 'Select File Location...',
    properties: multiple ? ['openFile', 'multiSelections'] : ['openFile'],
    filters: [
      {
        name: 'Financial Transactions File',
        extensions: fileTypes ?? [],
      },
    ],
  })
  if (filePath.length === 0) return null
  return filePath[0]
}

/**
 * Open file and get any mappings from the file for the next step
 *
 * @param file          File path to open
 * @param delimiter     The delimiter used in the file if CSV
 * @returns             ParsedFileMappings object
 */
export async function onGetFileMappings(file: string, delimiter?: string) {
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
export async function onReconcileTransactions(file: string, mapper: ImportTransactionsMapper) {
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
export async function onImportTransactions(transactions: ReconciledTransaction[]) {
  await CommandsClient.executeAppCommand(AppCommandIds.IMPORT_TRANSACTIONS, {
    reconciledTransactions: transactions,
  })
}
