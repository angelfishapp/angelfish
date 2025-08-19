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
import { useTranslate } from '@/utils/i18n'
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
  const { BankAccountDrawer: t } = useTranslate('components.drawers')

  // Setup Form
  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<BankAccountFormValues>({
    mode: 'onBlur',
  })

  const currency = watch('currency')
  const owners = watch('owners')
  const accountType = watch('type')
  if (initialValue?.id === undefined && !dirtyFields?.name) {
    // Set a default name for the account based on owner and account type
    if (accountType && owners?.length > 0) {
      setValue(
        'name',
        owners?.length == 1
          ? `${owners[0].first_name}'s ${accountType.name}`
          : `Joint ${accountType.name}`,
      )
    }
  }

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
        is_open: initialValue?.acc_is_open ?? true,
      })
    }
  }, [initialValue, open, reset])

  /**
   * Form Fields
   */

  const institutionField = (
    <Controller
      name="institution"
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value, ...restField } }) => (
        <InstitutionField
          institutions={institutions}
          label={t['institution']}
          fullWidth
          required
          placeholder={t['institutionPlaceholder']}
          onChange={(institution) => {
            onChange(institution)
            const country = getCountryFromCode(institution.country)
            setValue('currency', country?.currency as string)
          }}
          value={value ?? null}
          error={errors?.institution ? true : false}
          helperText={errors?.institution ? t['errorInstitution'] : undefined}
          {...restField}
        />
      )}
    />
  )

  const nameField = (
    <Controller
      name="name"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <TextField
          id="name"
          label={t['name']}
          placeholder={t['namePlaceholder']}
          fullWidth
          required
          error={errors?.name ? true : false}
          helperText={errors?.name ? t['errorName'] : t['nameHelper']}
          {...field}
        />
      )}
    />
  )

  const accountTypeField = (
    <Controller
      name="type"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <AccountTypeField
          label={t['accountType']}
          required
          fullWidth
          placeholder={t['typePlaceholder']}
          value={field.value}
          onChange={(accountType) => field.onChange(accountType || undefined)}
          error={errors?.type ? true : false}
          helperText={errors?.type ? t['errorAccountType'] : t['accountTypeHelper']}
        />
      )}
    />
  )

  const ownersField = (
    <Controller
      name="owners"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <UserField
          label={t['accountOwners']}
          required
          fullWidth
          users={users}
          value={field.value}
          onChange={(users) => field.onChange(users || [])}
          error={errors?.owners ? true : false}
          helperText={errors?.owners ? t['errorOwners'] : t['ownersHelper']}
        />
      )}
    />
  )

  const currencyField = (
    <Controller
      name="currency"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <CurrencyField
          label={t['currency']}
          required
          fullWidth
          placeholder={t['currencyPlaceholder']}
          value={field.value}
          onChange={(currency) => field.onChange(currency?.code || '')}
          error={errors?.currency ? true : false}
          helperText={errors?.currency ? t['errorCurrency'] : t['currencyHelper']}
        />
      )}
    />
  )

  const startBalanceField = (
    <Controller
      name="start_balance"
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <AmountField
          label={t['startBalance']}
          fullWidth
          value={value}
          allowNegative={true}
          currency={currency ? getCurrencyFromCode(currency)?.symbol : undefined}
          error={errors?.start_balance ? true : false}
          helperText={errors?.start_balance ? t['errorStartBalance'] : t['startBalanceHelper']}
          onChange={(value) => onChange(value)}
          {...restField}
        />
      )}
    />
  )

  const accountLimitField = (
    <Controller
      name="account_limit"
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <AmountField
          label={t['accountLimit']}
          fullWidth
          value={value}
          allowNegative={true}
          currency={currency ? getCurrencyFromCode(currency)?.symbol : undefined}
          error={errors?.account_limit ? true : false}
          helperText={errors?.account_limit ? t['errorAccountLimit'] : t['accountLimitHelper']}
          onChange={(value) => onChange(value)}
          {...restField}
        />
      )}
    />
  )

  const isOpenField = (
    <Controller
      name="is_open"
      control={control}
      render={({ field }) => (
        <SwitchField label={t['isOpen']} helperText={t['isOpenHelper']} {...field} />
      )}
    />
  )

  // Render the Drawer
  return (
    <Drawer
      title={initialValue?.id ? t['edit'] : t['add']}
      {...{ open, onClose }}
      disableSaveButton={!isValid || !isDirty}
      onSave={() => handleSubmit(handleSave)()}
    >
      {initialValue?.id !== undefined ? (
        <React.Fragment>
          {nameField}
          {institutionField}
          {accountTypeField}
          {ownersField}
          {currencyField}
          {startBalanceField}
          {accountLimitField}
          {isOpenField}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {institutionField}
          {accountTypeField}
          {ownersField}
          {nameField}
          {currencyField}
          {startBalanceField}
          {accountLimitField}
          {isOpenField}
        </React.Fragment>
      )}
    </Drawer>
  )
}
