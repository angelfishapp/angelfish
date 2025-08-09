import type { IAccount, ITag } from '@angelfish/core'
import type { TransactionRow } from '../../data'
import { DateSort } from '../../data'

/**
 * Process rows to get array of recently used categories. Will return last N Categories
 * depending on limit. Used to get initial categories for context menu.
 *
 * @param transactionRows   Sorted array of Transaction Rows from buildTransactionRows function
 * @param limit             Max number of categories to return (@default 5)
 */
export function getRecentCategories(transactionRows: TransactionRow[], limit = 5): IAccount[] {
  const recentCategories: IAccount[] = []

  // Step 1: Sort transactions by modified_on descending, fallback to transaction.id
  const sortedTransactions = transactionRows.slice().sort((a, b) => {
    return DateSort(
      b.transaction.modified_on,
      b.transaction.id,
      a.transaction.modified_on,
      a.transaction.id,
    )
  })

  // Step 2: Collect distinct categories in order of most recent usage
  for (const row of sortedTransactions) {
    if (!row.isSplit && row.category) {
      const alreadyIncluded = recentCategories.some((cat) => cat.id === row.category?.id)
      if (!alreadyIncluded) {
        recentCategories.push(row.category)
      }
      if (recentCategories.length >= limit) {
        break
      }
    }
  }

  return recentCategories
}

/**
 * Update the recent categories list by moving the specified category to the top.
 *
 * @param recentCategories  Array of recently used categories
 * @param category          The category to move to the top
 * @param limit             Maximum number of categories to keep in the list
 * @returns                 Updated array of recently used categories
 */
export function updateRecentCategories(
  recentCategories: IAccount[],
  category: IAccount,
  limit = 5,
): IAccount[] {
  // Move this category to the top of recent categories if it exists
  const index = recentCategories.findIndex((cat) => cat.id === category.id)
  if (index > -1) {
    recentCategories.splice(index, 1)
  }
  recentCategories.unshift(category)

  // Limit to max length
  return recentCategories.slice(0, limit)
}

/**
 * Process rows to get array of recently used tags. Will return last N Tags
 * depending on limit. Used to get initial tags for context menu.
 *
 * @param transactionRows   Sorted array of Transaction Rows from buildTransactionRows function
 * @param limit             Max number of tags to return (@default 5)
 */
export function getRecentTags(transactionRows: TransactionRow[], limit = 5): ITag[] {
  const recentTags: ITag[] = []

  // Step 1: Sort transactions by modified_on descending, fallback to transaction.id
  const sortedTransactions = transactionRows.slice().sort((a, b) => {
    return DateSort(
      b.transaction.modified_on,
      b.transaction.id,
      a.transaction.modified_on,
      a.transaction.id,
    )
  })

  // Step 2: Collect distinct tags in order of most recent usage
  for (const row of sortedTransactions) {
    if (row.tags && row.tags.length > 0) {
      for (const tag of row.tags) {
        const alreadyIncluded = recentTags.some((t) => t.id === tag.id)
        if (!alreadyIncluded) {
          recentTags.push(tag)
        }
        if (recentTags.length >= limit) {
          break
        }
      }
    }
    if (recentTags.length >= limit) {
      break
    }
  }

  return recentTags
}

/**
 * Update the recent tags list by moving the specified tags to the top.
 *
 * @param recentTags  Array of recently used tags
 * @param tags        The tags to move to the top
 * @param limit       Maximum number of tags to keep in the list
 * @returns           Updated array of recently used tags
 */
export function updateRecentTags(recentTags: ITag[], tags: ITag[], limit = 5): ITag[] {
  for (const tag of tags) {
    // Move this tag to the top of recent tags if it exists
    const index = recentTags.findIndex((t) => t.id === tag.id)
    if (index > -1) {
      recentTags.splice(index, 1)
    }
    recentTags.unshift(tag)
  }

  // Limit to max length
  return recentTags.slice(0, limit)
}
