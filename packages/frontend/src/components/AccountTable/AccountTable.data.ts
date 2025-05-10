import type { ColumnDef, SortingFn } from '@tanstack/react-table'

import type { AccountType, Country, IAccount, IInstitution, IUser } from '@angelfish/core'
import { getAccountType, getAccountTypeLabel, getCountryFromCode } from '@angelfish/core'

/**
 * Interface for Account Table Row
 */
export interface AccountTableRow {
  id: number
  acc_type: AccountType
  acc_country: Country
  acc_iso_currency: string
  acc_owners: string
  acc_owner_users: IUser[]
  acc_institution_id: number
  acc_institution?: IInstitution
  acc_is_open: boolean
  name: string
  current_balance: number
}

/**
 * Custom Sorting Function for Name Column. Depending on Grouping need to ensure
 * correct value is used for sorting Name or will use Account Name when Grouped.
 *
 * @param rowA        First Row to Compare
 * @param rowB        Second Row to Compare
 * @param _columnId   Column ID to Sort By
 * @returns           Sort Order (-1, 0, 1)
 */
const sortNameFn: SortingFn<AccountTableRow> = (rowA, rowB, _columnId) => {
  // Initialize name variables
  let nameA = ''
  let nameB = ''

  // Determine which value to use for sorting on rowA
  switch (rowA.groupingColumnId) {
    case 'acc_institution_id':
      nameA = rowA.original.acc_institution?.name?.toLowerCase() || ''
      break
    case 'acc_country':
      nameA = rowA.original.acc_country.name.toLowerCase()
      break
    case 'acc_owners':
      // Make sure joint & unknown accounts sort to bottom
      if (rowA.original.acc_owner_users.length === 0) {
        nameA = 'zzzzzz'
      } else if (rowA.original.acc_owner_users.length > 1) {
        nameA = `zzz${rowA.original.acc_owners}`.toLowerCase()
      } else {
        nameA = rowA.original.acc_owners.toLowerCase()
      }
      break
    case 'acc_type':
      nameA = getAccountTypeLabel(rowA.original.acc_type.type)?.toLowerCase()
      break
    default:
      nameA = rowA.original.name.toLowerCase()
      break
  }

  // Determine which value to use for sorting on rowB
  switch (rowB.groupingColumnId) {
    case 'acc_institution_id':
      nameB = rowB.original.acc_institution?.name?.toLowerCase() || ''
      break
    case 'acc_country':
      nameB = rowB.original.acc_country.name.toLowerCase()
      break
    case 'acc_owners':
      // Make sure joint & unknown accounts sort to bottom
      if (rowB.original.acc_owner_users.length === 0) {
        nameB = 'zzzzzz'
      } else if (rowB.original.acc_owner_users.length > 1) {
        nameB = `zzz${rowB.original.acc_owners}`.toLowerCase()
      } else {
        nameB = rowB.original.acc_owners.toLowerCase()
      }
      break
    case 'acc_type':
      nameB = getAccountTypeLabel(rowB.original.acc_type.type)?.toLowerCase()
      break
    default:
      nameB = rowB.original.name.toLowerCase()
      break
  }

  return nameB.localeCompare(nameA)
}

/**
 * Account Table Column Definitions
 */
export const AccountTableColumns: ColumnDef<AccountTableRow, any>[] = [
  {
    id: 'acc_type',
    header: 'Account Type',
    accessorKey: 'acc_type.type',
  },
  {
    id: 'acc_country',
    header: 'Country',
    accessorKey: 'acc_country.code',
  },
  {
    id: 'acc_currency',
    header: 'Currency',
    accessorKey: 'acc_iso_currency',
  },
  {
    id: 'acc_owners',
    header: 'Account Owner(s)',
    accessorKey: 'acc_owners',
  },
  {
    id: 'acc_institution_id',
    header: 'Institution',
    accessorKey: 'acc_institution_id',
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortingFn: sortNameFn,
  },
  {
    id: 'current_balance',
    header: 'Balance',
    accessorKey: 'current_balance',
    aggregationFn: 'sum',
  },
  {
    id: 'local_current_balance',
    header: 'Local Balance',
    accessorKey: 'local_current_balance',
    aggregationFn: 'sum',
  },
]

/**
 * Builds a list of table rows from a list of accounts and institutions passed to component. This ensures
 * that even if an institution exists without accounts it will still be displayed in the table with a row
 * to create an account. If no accounts or institutions are passed, an empty list will be returned.
 *
 * @param accounts            List of accounts from the Database, will automatically filter to only include accounts
 *                            of class 'ACCOUNT'
 * @param institutions        List of institutions from the Database
 * @param showClosedAccounts  Flag to determine if closed accounts should be displayed
 * @returns                   List of Account Table Rows
 */
export function buildTableRows(
  accounts: IAccount[],
  institutions: IInstitution[],
  showClosedAccounts: boolean,
): AccountTableRow[] {
  // Iterate through accounts and figure out which institutions have no accounts associated with them
  const institutionIDs = accounts.map((account) => account.acc_institution_id)
  const institutionIDsSet = new Set(institutionIDs)
  const institutionsWithoutAccounts = institutions.filter(
    (institution) => !institutionIDsSet.has(institution.id),
  )

  // Create a list of table rows for institutions without accounts
  // Will use id of -1 to indicate that this is not a real account
  const institutionRows: AccountTableRow[] = institutionsWithoutAccounts.map((institution) => ({
    id: -1,
    acc_type: getAccountType('other', 'other') as AccountType,
    acc_country: getCountryFromCode(institution.country) as AccountTableRow['acc_country'],
    acc_iso_currency: getCountryFromCode(institution.country)
      ?.currency as AccountTableRow['acc_iso_currency'],
    acc_owners: 'Unknown',
    acc_owner_users: [],
    acc_institution_id: institution.id,
    acc_institution: institution,
    acc_is_open: false,
    name: institution.name,
    current_balance: 0,
    local_current_balance: 0,
  }))

  // Create a list of table rows for accounts
  const accountRows: AccountTableRow[] = accounts
    .filter((a) => a.class === 'ACCOUNT')
    .filter((a) => showClosedAccounts || a.acc_is_open)
    .map((account) => ({
      id: account.id,
      acc_type: getAccountType(
        account.acc_type as string,
        account.acc_subtype as string,
      ) as AccountType,
      acc_country: getCountryFromCode(
        account.institution?.country || 'Unknown',
      ) as AccountTableRow['acc_country'],
      acc_iso_currency: account.acc_iso_currency || '',
      acc_owners:
        account.acc_owners
          ?.map((owner) => `${owner.first_name} ${owner.last_name}`)
          .sort()
          .join(' & ') || 'Unknown',
      acc_owner_users: account.acc_owners || [],
      acc_institution_id: account.acc_institution_id || -1,
      acc_institution: account.institution,
      acc_is_open: account.acc_is_open || false,
      name: account.name,
      current_balance: account.current_balance,
      local_current_balance: account.local_current_balance,
    }))

  return [...institutionRows, ...accountRows]
}
