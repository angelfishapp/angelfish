import { Brackets } from 'typeorm'

import type {
  AppCommandIds,
  AppCommandRequest,
  CategoryGroupType,
  CategorySpendReportData,
  CategorySpendReportDataCategoryRow,
  CategorySpendReportDataRow,
  CategoryType,
} from '@angelfish/core'
import { roundNumber, UNCLASSIFIED_EXPENSES_ID, UNCLASSIFIED_INCOME_ID } from '@angelfish/core'
import { DatabaseManager } from '../../database/database-manager'
import { getWorkerLogger } from '../../logger'

/**
 * Type for Row returned from database queries
 */
export type ReportResultRow = {
  // A string in the format "MM-YYYY"
  period: string
  cat_group_id: number
  cat_group_name: string
  cat_group_type: CategoryGroupType
  cat_group_icon: string
  cat_group_color: string | null
  cat_id: number
  cat_name: string
  cat_icon: string
  cat_type: CategoryType | 'Unknown'
  total: number
}

const logger = getWorkerLogger('CategorySpendReport')

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
export async function runCategorySpendReport({
  start_date,
  end_date,
  include_unclassified = true,
  category_ids,
  category_types,
  category_group_ids,
  category_group_types,
  tag_ids,
  account_ids,
  account_owner,
}: AppCommandRequest<AppCommandIds.RUN_REPORT>): Promise<CategorySpendReportData> {
  // Create a view with all the required joins and categorization logic for easier querying
  // This view will also filter out any line items that are transfers between accounts (CLASS = 'ACCOUNT') and return
  // multiple rows for line items with multiple tags or owners so needs to be deduplicated later
  const reportsQuery = DatabaseManager.getConnection()
    .createQueryBuilder()
    .from(
      (qb) =>
        qb
          .select('line_items.id', 'lid')
          .addSelect('transactions.id', 'tid')
          .addSelect('transactions.date', 'date')
          .addSelect('substr(transactions.date, 6, 2)', 'month')
          .addSelect('substr(transactions.date, 1, 4)', 'year')
          .addSelect('transactions.account_id', 'account')
          .addSelect('line_items.local_amount', 'amount')
          .addSelect('GROUP_CONCAT(DISTINCT tags.id)', 'tags')
          .addSelect('GROUP_CONCAT(DISTINCT users.id)', 'owners')
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL AND line_items.local_amount > 0 THEN ${UNCLASSIFIED_INCOME_ID}
                  WHEN line_items.account_id IS NULL AND line_items.local_amount < 0 THEN ${UNCLASSIFIED_EXPENSES_ID}
                  ELSE line_items.account_id
                END`,
            'cat_id',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL AND line_items.local_amount > 0 THEN 'Income'
                  WHEN line_items.account_id IS NULL AND line_items.local_amount < 0 THEN 'Expense'
                  ELSE category_groups.type
                END`,
            'cat_group_type',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL THEN NULL
                  ELSE category_groups.color
                END`,
            'cat_group_color',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL AND line_items.local_amount > 0 THEN ${UNCLASSIFIED_INCOME_ID}
                  WHEN line_items.account_id IS NULL AND line_items.local_amount < 0 THEN ${UNCLASSIFIED_EXPENSES_ID}
                  ELSE accounts.cat_group_id
                END`,
            'cat_group_id',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL AND line_items.local_amount > 0 THEN 'Unclassified Income'
                  WHEN line_items.account_id IS NULL AND line_items.local_amount < 0 THEN 'Unclassified Expenses'
                  ELSE category_groups.name
                END`,
            'cat_group_name',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL THEN 'question'
                  ELSE category_groups.icon
                END`,
            'cat_group_icon',
          )
          .addSelect(
            `CASE 
                  WHEN line_items.account_id IS NULL AND line_items.local_amount > 0 THEN 'Unclassified Income'
                  WHEN line_items.account_id IS NULL
                  AND line_items.local_amount < 0 THEN 'Unclassified Expenses'
                  ELSE accounts.name
                END`,
            'cat_name',
          )
          .addSelect(
            `CASE
                  WHEN line_items.account_id IS NULL THEN 'question'
                  ELSE accounts.cat_icon
                END`,
            'cat_icon',
          )
          .addSelect(
            `CASE
                  WHEN line_items.account_id IS NULL THEN 'Unknown'
                  ELSE accounts.cat_type
                END`,
            'cat_type',
          )
          .from('line_items', 'line_items')
          .leftJoin('transactions', 'transactions', 'transactions.id = line_items.transaction_id')
          .leftJoin('accounts', 'accounts', 'accounts.id = line_items.account_id')
          .leftJoin(
            'category_groups',
            'category_groups',
            'category_groups.id = accounts.cat_group_id',
          )
          .leftJoin(
            'line_item_tags',
            'line_item_tags',
            'line_item_tags.line_item_id = line_items.id',
          )
          .leftJoin('tags', 'tags', 'tags.id = line_item_tags.tag_id')
          .leftJoin(
            'account_owners',
            'account_owners',
            'account_owners.account_id = transactions.account_id',
          )
          .leftJoin('users', 'users', 'users.id = account_owners.user_id')
          .where("(accounts.class IS NULL OR accounts.class != 'ACCOUNT')")
          .groupBy('lid'),
      'reports_view',
    )

  logger.silly('Reports View Query: ', reportsQuery.getSql())

  // Query against the view to get the final result
  reportsQuery
    .select("reports_view.month || '-' || reports_view.year", 'period')
    .addSelect('reports_view.cat_id', 'cat_id')
    .addSelect('reports_view.cat_name', 'cat_name')
    .addSelect('reports_view.cat_icon', 'cat_icon')
    .addSelect('reports_view.cat_type', 'cat_type')
    .addSelect('reports_view.cat_group_id', 'cat_group_id')
    .addSelect('reports_view.cat_group_name', 'cat_group_name')
    .addSelect('reports_view.cat_group_icon', 'cat_group_icon')
    .addSelect('reports_view.cat_group_type', 'cat_group_type')
    .addSelect('reports_view.cat_group_color', 'cat_group_color')
    .addSelect('COALESCE(ROUND(SUM(reports_view.amount), 2), 0)', 'total')
    .where('reports_view.date BETWEEN :start_date AND :end_date', { start_date, end_date })
    .groupBy('cat_id')
    .addGroupBy('period')
    .orderBy('period', 'ASC')

  // Include unclassified line items if requested
  if (include_unclassified) {
    // If include_unclassified is true, add unclassified categories/groups to the include list
    // This allows the report to include unclassified income and expenses
    if (!category_ids) {
      category_ids = { include: [UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID] }
    } else if (category_ids.include) {
      category_ids.include.push(UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID)
    } else {
      category_ids.include = [UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID]
    }
    if (!category_group_ids) {
      category_group_ids = { include: [UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID] }
    } else if (category_group_ids.include) {
      category_group_ids.include.push(UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID)
    } else {
      category_group_ids.include = [UNCLASSIFIED_INCOME_ID, UNCLASSIFIED_EXPENSES_ID]
    }
  }
  // Filter by category IDs if provided
  if (category_ids) {
    if (category_ids.include && category_ids.include.length > 0) {
      reportsQuery.andWhere('cat_id IN (:...category_ids)', { category_ids: category_ids.include })
    }
    if (category_ids.exclude && category_ids.exclude.length > 0) {
      reportsQuery.andWhere('cat_id NOT IN (:...excludedCatIds)', {
        excludedCatIds: category_ids.exclude,
      })
    }
  }
  // Filter by category types if provided
  if (category_types) {
    if (category_types.include && category_types.include.length > 0) {
      reportsQuery.andWhere('cat_type IN (:...category_types)', { category_types })
    }
    if (category_types.exclude && category_types.exclude.length > 0) {
      reportsQuery.andWhere('cat_type NOT IN (:...excludedCatTypes)', {
        excludedCatTypes: category_types.exclude,
      })
    }
  }
  // Filter by category group IDs if provided
  if (category_group_ids) {
    if (category_group_ids.include && category_group_ids.include.length > 0) {
      reportsQuery.andWhere('cat_group_id IN (:...category_group_ids)', { category_group_ids })
    }
    if (category_group_ids.exclude && category_group_ids.exclude.length > 0) {
      reportsQuery.andWhere('cat_group_id NOT IN (:...excludedCatGroupIds)', {
        excludedCatGroupIds: category_group_ids.exclude,
      })
    }
  }
  // Filter by category group types if provided
  if (category_group_types) {
    if (category_group_types.include && category_group_types.include.length > 0) {
      reportsQuery.andWhere('cat_group_type IN (:...category_group_types)', {
        category_group_types: category_group_types.include,
      })
    }
    if (category_group_types.exclude && category_group_types.exclude.length > 0) {
      reportsQuery.andWhere('cat_group_type NOT IN (:...excludedCatGroupTypes)', {
        excludedCatGroupTypes: category_group_types.exclude,
      })
    }
  }
  // Filter by tag IDs if provided
  if (tag_ids) {
    if (tag_ids.include && tag_ids.include.length > 0) {
      reportsQuery.andWhere(
        new Brackets((qb) => {
          tag_ids.include?.forEach((tagId, idx) => {
            const paramName = `tagMatch${idx}`
            qb.orWhere(`',' || reports_view.tags || ',' LIKE :${paramName}`, {
              [paramName]: `%,${tagId},%`,
            })
          })
        }),
      )
    }
    if (tag_ids.exclude && tag_ids.exclude.length > 0) {
      reportsQuery.andWhere(
        new Brackets((qb) => {
          tag_ids.exclude?.forEach((tagId, idx) => {
            const paramName = `excludedTagMatch${idx}`
            qb.andWhere(`',' || reports_view.tags || ',' NOT LIKE :${paramName}`, {
              [paramName]: `%,${tagId},%`,
            })
          })
        }),
      )
    }
  }
  // Filter by account IDs if provided
  if (account_ids) {
    if (account_ids.include && account_ids.include.length > 0) {
      reportsQuery.andWhere('reports_view.account IN (:...account_ids)', { account_ids })
    }
    if (account_ids.exclude && account_ids.exclude.length > 0) {
      reportsQuery.andWhere('reports_view.account NOT IN (:...excludedAccountIds)', {
        excludedAccountIds: account_ids.exclude,
      })
    }
  }
  // Filter by account owner if provided
  if (account_owner) {
    reportsQuery.andWhere("',' || reports_view.owners || ',' LIKE :ownerMatch", {
      ownerMatch: `%,${account_owner},%`,
    })
  }

  logger.silly('Reports Final Query: ', reportsQuery.getSql())
  const rawResults: ReportResultRow[] = await reportsQuery.getRawMany<ReportResultRow>()
  const periods = generatePeriodRange(start_date, end_date)

  // Transform flat results into nested structure with dynamic period keys
  // Reorganise results into structure described above so its easy to render table
  const results = rawResults.reduce<CategorySpendReportData>(
    (all, row) => {
      // Create table category group rows with categories as sub-rows
      const rowIndex = all['rows'].findIndex((x) => {
        if (x.id) {
          return x.id === row.cat_group_id
        }
      })
      if (rowIndex === -1) {
        // Doesn't exist, create new row and subrow
        const newCategory: CategorySpendReportDataCategoryRow = {
          id: row.cat_id,
          name: row.cat_name,
          icon: row.cat_icon,
          type: row.cat_type,
          total: row.total,
        }
        newCategory[row.period] = row.total
        const newRow: CategorySpendReportDataRow = {
          id: row.cat_group_id,
          name: row.cat_group_name,
          icon: row.cat_group_icon,
          type: row.cat_group_type,
          color: row.cat_group_color ?? undefined,
          total: row.total,
          categories: [newCategory],
        }
        newRow[row.period] = row.total
        all['rows'].push(newRow)
      } else {
        // Add to existing total
        const existingRow = all['rows'][rowIndex]
        existingRow[row.period] = existingRow[row.period]
          ? existingRow[row.period] + row.total
          : row.total
        existingRow['total'] += row.total
        // Get category and add period to object
        const subRowIndex = existingRow.categories?.findIndex((x) => x.id === row.cat_id)
        if (subRowIndex === -1) {
          // Doesn't exist, create new subrow
          const newCategory: CategorySpendReportDataCategoryRow = {
            id: row.cat_id,
            name: row.cat_name,
            icon: row.cat_icon,
            type: row.cat_type,
            total: row.total,
          }
          newCategory[row.period] = row.total
          existingRow.categories?.push(newCategory)
        } else {
          if (!existingRow.categories) {
            logger.warn('Existing Row has Categories array undefined', existingRow)
            return all
          }
          // Add period to subrow object
          existingRow.categories[subRowIndex as number][row.period] = row.total
          // Add to existing total
          existingRow.categories[subRowIndex as number]['total'] += row.total
        }
      }

      return all
    },
    { periods: [...periods, 'total'], rows: [] },
  )

  // Make sure all periods are represented in each row and subrow and round to 2 decimal places
  for (const row of results.rows) {
    // Round all period values to 2 decimal places
    for (const period of periods) {
      row[period] = roundNumber(row[period] ?? 0, 2)
    }
    // Round total to 2 decimal places
    row.total = roundNumber(row.total ?? 0, 2)

    // Add missing periods to each category subrow
    row.categories?.forEach((cat) => {
      for (const period of periods) {
        cat[period] = roundNumber(cat[period] ?? 0, 2)
      }
      cat.total = roundNumber(cat.total ?? 0, 2)
    })
  }

  logger.debug('Running Report with query', results)
  return results
}

/**
 * Generates a range of periods (months) between two dates.
 *
 * @param startDate     The start date in YYYY-MM-DD format.
 * @param endDate       The end date in YYYY-MM-DD format.
 * @returns             An array of period strings in the format "MM-YYYY".
 */
function generatePeriodRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const ranges: string[] = []
  let current = new Date(start.getFullYear(), start.getMonth(), 1)

  while (current <= end) {
    const month = current.getMonth() + 1
    const year = current.getFullYear()
    ranges.push(`${month.toString().padStart(2, '0')}-${year}`)
    // Move to the 1st of the next month
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
  }

  return ranges
}
