import type { CategoryGroupType, CategoryType } from '../types'

/**
 * Category Types
 */

export type CategoryTypeLookup = {
  type: CategoryType
  groupType: CategoryGroupType
}

export const allCategoryTypes: Array<CategoryTypeLookup> = [
  // Income Category Types
  { groupType: 'Income', type: 'Earned' },
  { groupType: 'Income', type: 'Passive' },
  { groupType: 'Income', type: 'Other' },
  // Expense Category Types
  { groupType: 'Expense', type: 'Critical' },
  { groupType: 'Expense', type: 'Important' },
  { groupType: 'Expense', type: 'Optional' },
  { groupType: 'Expense', type: 'Investment' },
  { groupType: 'Expense', type: 'Taxes' },
]

/**
 * Get list of Category Group Types for select dropdowns
 */
export function getCategoryGroupTypeOptions(): Array<{
  name: CategoryGroupType
  value: CategoryGroupType
}> {
  return [
    { name: 'Income', value: 'Income' },
    { name: 'Expense', value: 'Expense' },
  ]
}

/**
 * Get list of Category Types for specific Category Group Type for select dropdowns
 *
 * @param groupType     The Category Group
 * @requires            Array<{ name: string, value: string }>
 */
export function getCategoryTypeOptions(
  groupType: CategoryGroupType,
): Array<{ name: string; value: string }> {
  const options: Array<{ name: string; value: string }> = []
  const catTypes = allCategoryTypes.filter((catType) => catType.groupType === groupType)
  for (const catType of catTypes) {
    options.push({
      name: catType.type,
      value: catType.type,
    })
  }
  return options
}

/**
 * Validate a valid Category type is assigned to a Category Group
 *
 * @param categoryGroupType     The Category Group the Category belongs too
 * @param categoryType          The Category Type
 * @throws                      Error if validation error
 */
export function validateCategoryType(
  categoryGroupType: CategoryGroupType,
  categoryType: CategoryType,
) {
  const catLookup = allCategoryTypes.filter((lookup) => lookup.type == categoryType)

  if (catLookup.length < 1) {
    throw Error(`Validation Error: Category type ${categoryType} is not a valid Category type`)
  }

  if (catLookup[0].groupType != categoryGroupType) {
    throw Error(
      `Validation Error: Category type ${categoryType} is not a valid ${categoryGroupType} type`,
    )
  }
}
