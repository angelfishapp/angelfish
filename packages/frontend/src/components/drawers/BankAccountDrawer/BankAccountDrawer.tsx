import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { AccountTypeField } from '@/components/forms/AccountTypeField'
import { AmountField } from '@/components/forms/AmountField'
import { CurrencyField } from '@/components/forms/CurrencyField'
import { InstitutionField } from '@/components/forms/InstitutionField'
import { SwitchField } from '@/components/forms/SwitchField'
import { TextField } from '@/components/forms/TextField'
import { UserField } from '@/components/forms/UserField'
import type { AccountType, IAccount, IInstitution, IUser } from '@angelfish/core'
import { getAccountType, getCountryFromCode, getCurrencyFromCode } from '@angelfish/core'
import type { BankAccountDrawerProps } from './BankAccountDrawer.interface'

/**
 * Form Properties
 */

type BankAccountFormValues = {
  institution: IInstitution
  name: string
  type?: AccountType
  owners: IUser[]
  currency: string
  start_balance: number
  account_limit: number
  is_open: boolean
}

/**
 * Drawer for creating or editing a Bank Account. If initialValue is provided, the drawer will be in edit mode,
 * otherwise will be in create mode.
 */
export default function BankAccountDrawer({
  institutions,
  initialValue,
  users,
  open = true,
  onClose,
  onSave,
}: BankAccountDrawerProps) {
  // Setup Form
  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<BankAccountFormValues>({
    mode: 'onBlur',
  })

  const currency = watch('currency')

  /**
   * Handle updating or saving the User
   */
  const handleSave = (formData: BankAccountFormValues) => {
    const account = initialValue
      ? structuredClone(initialValue)
      : ({ class: 'ACCOUNT' } as IAccount)
    account.acc_institution_id = formData.institution.id
    account.name = formData.name
    account.acc_type = formData.type?.type
    account.acc_subtype = formData.type?.subtype
    account.acc_owners = formData.owners
    account.acc_iso_currency = formData.currency
    account.acc_start_balance = formData.start_balance
    account.acc_limit = formData.account_limit
    account.acc_is_open = formData.is_open
    onSave(account)
    onClose?.()
  }

  /**
   * Make sure form is reset whenever initialValue is changed
   */
  React.useEffect(() => {
    if (open) {
      reset({
        institution: initialValue?.institution,
        name: initialValue?.name ?? '',
        type:
          getAccountType(initialValue?.acc_type ?? '', initialValue?.acc_subtype ?? '') ||
          undefined,
        owners: initialValue?.acc_owners,
        currency: initialValue?.acc_iso_currency,
        start_balance: initialValue?.acc_start_balance,
        account_limit: initialValue?.acc_limit,
        is_open: initialValue?.acc_is_open,
      })
    }
  }, [initialValue, open, reset])

  return (
    <Drawer
      title={initialValue?.id ? 'Edit Bank Account' : 'Add New Bank Account'}
      {...{ open, onClose }}
      disableSaveButton={!isValid || !isDirty}
      onSave={() => handleSubmit(handleSave)()}
    >
      <React.Fragment>
        <Controller
          name="institution"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ...restField } }) => (
            <InstitutionField
              institutions={institutions}
              label="Institution"
              fullWidth
              required
              onChange={(institution) => {
                onChange(institution)
                const country = getCountryFromCode(institution.country)
                setValue('currency', country?.currency as string)
              }}
              value={value ?? null}
              error={errors?.institution ? true : false}
              helperText={errors?.institution ? 'Institution is required' : undefined}
              {...restField}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              id="name"
              label="Name"
              placeholder="E.g. HSBC Current Account"
              fullWidth
              required
              error={errors?.name ? true : false}
              helperText={
                errors?.name
                  ? 'Name is required'
                  : "Put the ower's first name or 'Joint' at the beginning to determine the ownership of the account."
              }
              {...field}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <AccountTypeField
              label="Account Type"
              required
              fullWidth
              value={field.value}
              onChange={(accountType) => field.onChange(accountType || undefined)}
              error={errors?.type ? true : false}
              helperText={
                errors?.type
                  ? 'Account Type is required'
                  : 'The type of Account (i.e. Checking Account).'
              }
            />
          )}
        />

        <Controller
          name="owners"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <UserField
              label="Account Owners"
              required
              fullWidth
              users={users}
              value={field.value}
              onChange={(users) => field.onChange(users || [])}
              error={errors?.owners ? true : false}
              helperText={
                errors?.owners
                  ? 'At least 1 Account Owner is required'
                  : 'Who does this Account belong to? Can select multiple users if joint account.'
              }
            />
          )}
        />

        <Controller
          name="currency"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CurrencyField
              label="Currency"
              required
              fullWidth
              value={field.value}
              onChange={(currency) => field.onChange(currency?.code || '')}
              error={errors?.currency ? true : false}
              helperText={
                errors?.currency
                  ? 'Currency is required'
                  : 'The currency the account is denominated in.'
              }
            />
          )}
        />

        <Controller
          name="start_balance"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <AmountField
              label="Starting Balance"
              fullWidth
              value={value}
              allowNegative={true}
              currency={currency ? getCurrencyFromCode(currency)?.symbol : undefined}
              error={errors?.start_balance ? true : false}
              helperText={
                errors?.start_balance
                  ? 'Start Balance must be a Valid Amount'
                  : 'Enter a starting balance for the account that matches the balance of the account for the first transaction.'
              }
              onChange={(value) => onChange(value)}
              {...restField}
            />
          )}
        />

        <Controller
          name="account_limit"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <AmountField
              label="Account Limit"
              fullWidth
              value={value}
              allowNegative={true}
              currency={currency ? getCurrencyFromCode(currency)?.symbol : undefined}
              error={errors?.account_limit ? true : false}
              helperText={
                errors?.account_limit
                  ? 'Account Limit must be a Valid Amount'
                  : 'The overdraft or credit limit for the Account if any.'
              }
              onChange={(value) => onChange(value)}
              {...restField}
            />
          )}
        />

        <Controller
          name="is_open"
          control={control}
          render={({ field }) => (
            <SwitchField
              label="Is Account Open?"
              helperText="Is the account currently open or closed?"
              {...field}
            />
          )}
        />
      </React.Fragment>
    </Drawer>
  )
}
