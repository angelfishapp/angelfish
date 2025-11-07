import type {
  AppCommandRequest,
  AppCommandResponse,
  CategoryGroupType,
  CategoryType,
} from '@angelfish/core'
import { AppCommandIds, Command } from '@angelfish/core'
import { getWorkerLogger } from '../../logger'
import { ExportXLSX } from './export-xlsx'
import { runCategorySpendReport } from './reports-category-spend'
import { runNetWorthReport } from './reports-net-worth'

const logger = getWorkerLogger('ReportsService')

/**
 * Type for Row returned from database queries
 */
export type ReportResultRow = {
  month: string
  cat_group_id: number | null
  cat_group_name: string
  cat_group_type: CategoryGroupType
  cat_group_icon: string
  cat_group_color: string
  cat_id: number | null
  cat_name: string
  cat_icon: string
  cat_type: CategoryType | 'Unknown'
  total: number
}

/**
 * Manages Reports Table and provides main methods to generate queries for
 * displaying reports in App
 */
class ReportsServiceClass {
  /**
   * Returns a monthly breakdown of expenses grouped by CategoryGroup and Category. Returns the following
   * object:
   *
   * {
   *    periods: ["01-2021", "02-2021"..."total"],
   *    rows: [
   *      {
   *        id: 1,
   *        name: "Bank Charges",
   *        icon: "bank",
   *        cat_type: "Expense",
   *        "01-2021": 200.12
   *        "02-2021": 0,
   *        ...
   *        "total": 200.12,
   *        categories: [
   *          {
   *            id: 2,
   *            name: "Service Charges",
   *            icon: "bank",
   *            "01-2021": 200.12
   *            "02-2021": 0,
   *            ...
   *            "total": 200.12,
   *          }
   *        ]
   *      }
   *    ]
   * }
   *
   * This allows React-Table to render table by looking up keys for each period (header), expand subrows (categories)
   * and display total column at end for each row. You can group on cat_type to aggregate income and expense categories
   *
   * @param query                 The query settings to filter the report by
   * @returns                     Object as described above
   */
  @Command(AppCommandIds.RUN_REPORT)
  public async runReport(
    request: AppCommandRequest<AppCommandIds.RUN_REPORT>,
  ): AppCommandResponse<AppCommandIds.RUN_REPORT> {
    /* First get all the classified line items that aren't transfers between accounts
     * summed by month in mmm-YY format and category as it would be in rendered table
     *
     * Uses Common Table Expressions to create virtual tables to get final result:
     *
     * 1. First compute all the days between date range so we don't end up with missing months in table if no line items
     *    exist those months
     * 2. Then compute all the distinct categories for that date range (ignoring transfers) so we have consistent category
     *    rows for every month even if no values exist that month
     * 3. Combine these two results into a table that has a row for every category for each day (reportTable)
     * 4. Create another virtual table to get all the lineItems with their dates from the transactions table
     * 5. Finally join the lineItems to the report table, sum the amounts and group by month so we get the output we want
     */

    switch (request.report_type) {
      case 'category_spend': {
        const results = await runCategorySpendReport(request.query)
        return {
          report_type: 'category_spend',
          results,
        }
      }
      case 'net_worth': {
        const results = await runNetWorthReport(request.query)
        return {
          report_type: 'net_worth',
          results,
        }
      }
      default:
        // @ts-expect-error Fallback in case user passes invalid type
        logger.error(`Unsupported report type ${request.report_type}`)
        // @ts-expect-error Fallback in case user passes invalid type
        throw new Error(`Unsupported report type ${request.report_type}`)
    }
  }

  /**
   * Export a report to an Excel (XLSX) file. In future will support other formats
   *
   * @param filePath    The path to save the file to
   * @param fileType    The File Type to export as
   * @param query       The query settings to filter the report by
   */
  @Command(AppCommandIds.EXPORT_REPORT)
  public async exportReport({
    filePath,
    fileType,
    query,
  }: AppCommandRequest<AppCommandIds.EXPORT_REPORT>): AppCommandResponse<AppCommandIds.EXPORT_REPORT> {
    logger.info(`Exporting Report with format ${fileType} to ${filePath}`)

    // Get the report data
    const reportData = await this.runReport(query)

    switch (fileType) {
      case 'XLSX':
        // Write the XLSX file
        ExportXLSX.Export(reportData, filePath)
        break
      default:
        throw new Error(`Unsupported File Type ${fileType}`)
    }
  }
}

// Export instance of Class
export const ReportsService = new ReportsServiceClass()
