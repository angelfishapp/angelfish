/**
 * Selectors to get data from Store
 */

import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../reducers'

import { selectAllCategoryGroups } from '@/redux/categoryGroups/selectors'
import { selectAllInstitutions } from '@/redux/institutions/selectors'
import { selectAllUsers } from '@/redux/users/selectors'
import type { IAccount, IUser } from '@angelfish/core'

/**
 * Fetches all the Accounts in the Store
 */
export const selectAllAccounts = (state: RootState) => state.accounts.accounts

/**
 * Fetches all the Accounts in the store with parent Institutions/Categories attached
 */
export const selectAllAccountsWithRelations = createSelector(
  [selectAllAccounts, selectAllCategoryGroups, selectAllInstitutions, selectAllUsers],
  (accounts, categoryGroups, institutions, users) => {
    const finalAccounts: IAccount[] = []

    accounts.forEach((account) => {
      const copiedAccount: IAccount = { ...account }
      if (copiedAccount.class == 'CATEGORY') {
        const categoryGroup = categoryGroups.filter(
          (categoryGroup) => categoryGroup.id == account.cat_group_id,
        )[0]
        if (categoryGroup) {
          copiedAccount.categoryGroup = { ...categoryGroup }
          finalAccounts.push(copiedAccount)
        }
      } else {
        // Iterate over acc_owners field to ensure owners are up to date
        // Ensures changes to any users is propagated whenever accounts are reloaded
        const owners: IUser[] = []
        if (copiedAccount.acc_owners) {
          for (const owner of copiedAccount.acc_owners) {
            const user = users.filter((user) => user.id == owner.id)[0]
            if (user) {
              owners.push(user)
            }
          }
        }
        copiedAccount.acc_owners = owners

        // Add Institution
        const institution = institutions.filter(
          (institution) => institution.id == account.acc_institution_id,
        )[0]
        copiedAccount.institution = { ...institution }
        finalAccounts.push(copiedAccount)
      }
    })

    return finalAccounts
  },
)

/**
 * Fetches all the Accounts with class 'CATEGORY' in the Store
 * Use this to get all Categories
 */
export const selectAllCategories = createSelector(selectAllAccounts, (state) => {
  return state.filter((account) => {
    return account.class == 'CATEGORY'
  }) as IAccount[]
})

/**
 * Fetches all the Accounts with class 'ACCOUNT' in the Store
 * Use this to get all Bank Accounts
 */
export const selectAllBankAccounts = createSelector(selectAllAccounts, (state) => {
  return state.filter((account) => {
    return account.class == 'ACCOUNT'
  }) as IAccount[]
})
