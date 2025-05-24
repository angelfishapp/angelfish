import { useQuery } from '@tanstack/react-query'
import React from 'react'

import type { AppCommandRequest, IAccount, IUser } from '@angelfish/core'
import { AppCommandIds, CommandsClient } from '@angelfish/core'
import { useListCategoryGroups } from '../categoryGroups'
import { useListInstitutions } from '../institutions'
import { useListUsers } from '../users'

/**
 * React-Query Hook that lists Accounts for a given query
 *
 * @param query   Query object with following properties:
 *                - account_class: Only get Accounts of class 'CATEGORY' or 'ACCOUNT'
 *                - category_group_id: Only get Accounts in the specified Category Group
 *                - institution_id: Only get Accounts at the specified Institution
 *
 * @returns       accounts (IAccount[]), isLoading (boolean), error (Error or null)
 */
export const useListAccounts = (query: AppCommandRequest<AppCommandIds.LIST_ACCOUNTS>) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts', query],
    queryFn: async () => {
      const result = await CommandsClient.executeAppCommand(AppCommandIds.LIST_ACCOUNTS, query)
      return result
    },
  })

  return { accounts: data ?? [], isLoading, error }
}

/**
 * React-Query Hook to list all Accounts with their related entities loaded
 *
 * @returns    accounts (IAccount[]), isLoading (boolean)
 */
export function useListAllAccountsWithRelations() {
  const { accounts, isLoading: aLoading } = useListAccounts({})
  const { categoryGroups, isLoading: cgLoading } = useListCategoryGroups()
  const { institutions, isLoading: iLoading } = useListInstitutions()
  const { users, isLoading: uLoading } = useListUsers()

  const isLoading = aLoading || cgLoading || iLoading || uLoading

  const accountsWithRelations = React.useMemo(() => {
    const finalAccounts: IAccount[] = []

    accounts.forEach((account) => {
      const copiedAccount: IAccount = { ...account }

      if (copiedAccount.class === 'CATEGORY') {
        const categoryGroup = categoryGroups.find((cg) => cg.id === copiedAccount.cat_group_id)
        if (categoryGroup) {
          copiedAccount.categoryGroup = { ...categoryGroup }
          finalAccounts.push(copiedAccount)
        }
      } else {
        // Update acc_owners
        const owners: IUser[] = []
        if (copiedAccount.acc_owners) {
          for (const owner of copiedAccount.acc_owners) {
            const user = users.find((u) => u.id === owner.id)
            if (user) {
              owners.push(user)
            }
          }
        }
        copiedAccount.acc_owners = owners

        // Add Institution
        const institution = institutions.find(
          (inst) => inst.id === copiedAccount.acc_institution_id,
        )
        if (institution) {
          copiedAccount.institution = { ...institution }
        }

        finalAccounts.push(copiedAccount)
      }
    })

    return finalAccounts
  }, [accounts, categoryGroups, institutions, users])

  return {
    isLoading,
    accounts: accountsWithRelations,
  }
}
