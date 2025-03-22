import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { AvatarField } from '@/components/forms/AvatarField'
import { CountryField } from '@/components/forms/CountryField'
import { InstitutionSearchField } from '@/components/forms/InstitutionSearchField'
import { SwitchField } from '@/components/forms/SwitchField'
import { TextField } from '@/components/forms/TextField'
import type { IInstitutionUpdate } from '@angelfish/core'
import type { InstitutionDrawerProps } from './InstitutionDrawer.interface'

/**
 * Form Properties
 */

type FormValues = {
  name: string
  url: string
  country: string
  is_open: boolean
  logo?: string
}

/**
 * Drawer to add or edit an Institution
 */

export default function InstitutionDrawer({
  initialValue,
  open = true,
  onClose,
  onSave,
  onRemove,
  onSearch,
}: InstitutionDrawerProps) {
  // Form State
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: 'onBlur',
  })

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialValue?.name ?? '',
        url: initialValue?.url ?? '',
        country: initialValue?.country ?? '',
        is_open: initialValue?.is_open ?? true,
        logo: initialValue?.logo ?? '',
      })
    }
  }, [initialValue, open, reset])

  /**
   * Callback to handle saving Form
   */
  const onSubmit = (formData: FormValues) => {
    const updatedInstitution: IInstitutionUpdate = {
      name: formData.name,
      country: formData.country,
      url: formData.url,
      logo: formData.logo,
      is_open: formData.is_open,
    }
    if (initialValue?.id) {
      updatedInstitution.id = initialValue.id
    }
    onSave?.(updatedInstitution)
  }

  // Render
  return (
    <Drawer
      title={initialValue ? 'Edit Institituion' : 'Add Institution'}
      open={open}
      onClose={onClose}
      menuItems={
        initialValue?.id
          ? [
              {
                label: 'Remove Institution',
                onClick: () => onRemove?.(initialValue.id as number),
                icon: DeleteIcon,
                color: 'error',
              },
            ]
          : undefined
      }
      disableSaveButton={!isValid || !isDirty}
      onSave={() => {
        handleSubmit(onSubmit)()
      }}
    >
      <React.Fragment>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, ...restField } }) => (
            <InstitutionSearchField
              label="Name"
              fullWidth
              required
              error={errors?.name ? true : false}
              helperText={errors?.name ? 'Name is required' : undefined}
              onSearch={onSearch}
              onChange={(name, institution) => {
                onChange(name)
                if (institution) {
                  setValue('country', institution.country)
                  setValue('url', institution.url ?? '')
                  setValue('logo', institution.logo ?? '')
                }
              }}
              {...restField}
            />
          )}
        />

        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <AvatarField
              label="Logo"
              Icon={AccountBalanceIcon}
              avatars={[]}
              size={100}
              error={errors?.logo ? true : false}
              helperText={errors?.logo ? 'Logo is invalid' : undefined}
              dialogSize={100}
              dialogTitle="Select Institution Logo"
              {...field}
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CountryField
              label="Country"
              required
              fullWidth
              value={field.value}
              onChange={(country) => field.onChange(country?.code ?? '')}
              error={errors?.country ? true : false}
              helperText={
                errors?.country
                  ? 'Country is required'
                  : 'The country where your accounts with the Institution are based in.'
              }
            />
          )}
        />

        <Controller
          name="url"
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return true
              let url
              try {
                url = new URL(value)
              } catch (_) {
                return false
              }
              return url.protocol === 'http:' || url.protocol === 'https:'
            },
          }}
          render={({ field }) => (
            <TextField
              label="Website"
              placeholder="E.g. https://www.hsbc.com"
              fullWidth
              error={errors?.url ? true : false}
              helperText={
                errors?.url
                  ? 'Please enter a valid URL. E.g. https://www.hsbc.com'
                  : 'The main website for the Institution'
              }
              {...field}
            />
          )}
        />

        <Controller
          name="is_open"
          control={control}
          render={({ field }) => (
            <SwitchField
              label="Is Institution Open?"
              helperText="Is the institution currently open or closed?"
              {...field}
            />
          )}
        />
      </React.Fragment>
    </Drawer>
  )
}
