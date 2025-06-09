import { AppCommandIds, type AppCommandRequest, CommandsClient } from '@angelfish/core'

/**
 * Runs a financial report for a specified date range.
 *
 * Executes the `RUN_REPORT` command and returns the report data.
 *
 * @param params - An object containing the report parameters.
 * @param params.start_date - The start date of the report range (format: 'yyyy-MM-dd').
 * @param params.end_date - The end date of the report range (format: 'yyyy-MM-dd').
 *
 * @returns A promise that resolves to an array of account objects (IAccount[]).
 */
export async function runReports({
  start_date,
  end_date,
}: AppCommandRequest<AppCommandIds.RUN_REPORT>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.RUN_REPORT, {
    start_date,
    end_date,
  })
}

/**
 * Exports the report to a file (e.g. CSV or PDF) at a specified file path.
 *
 * Executes the `EXPORT_REPORT` command to generate and save the report file.
 *
 * @param params - An object containing export parameters.
 * @param params.filePath - The full file path where the report will be saved.
 * @param params.fileType - The export file type (e.g. 'pdf', 'csv').
 * @param params.query - Optional query object or filters for the report data.
 *
 * @returns A promise that resolves when the report is successfully exported.
 */
export async function exportReports({
  filePath,
  fileType,
  query,
}: AppCommandRequest<AppCommandIds.EXPORT_REPORT>) {
  await CommandsClient.executeAppCommand(AppCommandIds.EXPORT_REPORT, {
    filePath,
    fileType,
    query,
  })
}
