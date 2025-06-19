import type { ReportsFilterList } from '@angelfish/core'

/**
 * Determines if a filter is an include or exclude filter based on its properties.
 * By default will return true if no filter is provided or if the filter is empty.
 *
 * @param filter    ReportsFilterList to determine if its an include filter
 * @returns         boolean indicating if the filter is an include filter
 */
export function isIncludeFilter<T>(filter?: ReportsFilterList<T>): boolean {
  const includeEmpty = Array.isArray(filter?.include) && filter.include.length === 0
  const excludeEmpty = !filter?.exclude || filter.exclude.length === 0
  const excludeHasValues = Array.isArray(filter?.exclude) && filter.exclude.length > 0

  return includeEmpty && excludeEmpty ? true : excludeHasValues ? false : true
}

/**
 * Returns the values of the filter based on whether it is an include or exclude filter.
 * If no filter is provided, returns an empty array.
 *
 * @param filter    ReportsFilterList to get the values from
 * @returns         Array of values from the filter
 */
export function getFilterValues<T>(filter?: ReportsFilterList<T>): T[] {
  if (!filter) return []

  if (isIncludeFilter(filter)) {
    return filter.include ?? []
  }
  return filter.exclude ?? []
}
