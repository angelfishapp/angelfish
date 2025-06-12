import { AppCommandIds, type AppCommandRequest, CommandsClient } from '@angelfish/core'

/**
 * Runs a financial report for a specified date range.
 *
 * @param request   A ReportQuery object containing the parameters for the report.
 * @returns         The CategorySpend Report Results.
 */
export async function runReport(request: AppCommandRequest<AppCommandIds.RUN_REPORT>) {
  return await CommandsClient.executeAppCommand(AppCommandIds.RUN_REPORT, request)
}

/**
 * Exports the report to a file (e.g. xlsx) at a specified file path.
 *
 * @param request   The request object for the export:
 *                      - `filePath`: The absolute file path where the report will be saved.
 *                      - `fileType`: The file type to export (e.g. 'xlsx').
 *                      - `query`: The ReportQuery object containing the parameters for the report.
 */
export async function exportReport(request: AppCommandRequest<AppCommandIds.EXPORT_REPORT>) {
  await CommandsClient.executeAppCommand(AppCommandIds.EXPORT_REPORT, request)
}
