import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { AvatarField } from '@/components/forms/AvatarField'
import { PhoneField } from '@/components/forms/PhoneField'
import { TextField } from '@/components/forms/TextField'
import type { IUser } from '@angelfish/core'
import type { UserDrawerProps } from './UserDrawer.interface'

/**
 * Form Properties
 */

type UserFormValues = {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone?: {
    number: string
    isValid: boolean
  }
  avatar?: string
}

/**
 * Drawer for creating or editing a User. If initialValue is provided, the drawer will be in edit mode,
 * otherwise will be in create mode.
 */
export default function UserDrawer({
  avatars,
  initialValue,
  open = true,
  onClose,
  onSave,
}: UserDrawerProps) {
  // Setup Form
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<UserFormValues>({
    mode: 'onBlur',
  })

  /**
   * Handle updating or saving the User
   */
  const handleSave = (formData: UserFormValues) => {
    const user = initialValue ? structuredClone(initialValue) : ({} as IUser)
    user.first_name = formData.first_name
    user.last_name = formData.last_name
    user.email = formData.email
    user.phone = formData.phone?.number
    user.avatar = formData.avatar
    onSave(user)
    onClose?.()
  }

  /**
   * Make sure form is reset whenever initialValue is changed
   */
  React.useEffect(() => {
    if (open) {
      if (initialValue) {
        reset({
          id: initialValue.id,
          first_name: initialValue.first_name,
          last_name: initialValue.last_name,
          email: initialValue.email,
          phone: { number: initialValue.phone?.replace(/\+/g, ''), isValid: true },
          avatar: initialValue.avatar,
        })
      } else {
        reset({
          id: undefined,
          first_name: '',
          last_name: '',
          email: '',
          phone: { number: '', isValid: true },
          // Select a random avatar if none given
          avatar: avatars[Math.floor(Math.random() * avatars.length)],
        })
      }
    }
  }, [initialValue, open, avatars, reset])

  return (
    <Drawer
      title={initialValue?.id ? 'Edit User' : 'Add User'}
      {...{ open, onClose }}
      disableSaveButton={!isValid || !isDirty}
      onSave={() => handleSubmit(handleSave)()}
    >
      <React.Fragment>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <AvatarField
              label="Avatar"
              avatars={avatars}
              size={100}
              error={errors?.avatar ? true : false}
              helperText={errors?.avatar ? 'Avatar is invalid' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="first_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="First Name"
              tabIndex={1}
              fullWidth
              autoFocus
              required
              placeholder="First Name"
              error={errors?.first_name ? true : false}
              helperText={errors?.first_name ? 'A First Name name is required' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="last_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="Last Name"
              tabIndex={2}
              fullWidth
              required
              placeholder="Last Name"
              error={errors?.last_name ? true : false}
              helperText={errors?.last_name ? 'A Last Name name is required' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          }}
          render={({ field }) => (
            <TextField
              label="Email"
              tabIndex={3}
              fullWidth
              required
              placeholder="Email"
              error={errors?.email ? true : false}
              helperText={errors?.email ? 'A valid Email is required' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{ required: false, validate: (value) => value?.isValid }}
          render={({ field: { onChange, value, ...restField } }) => (
            <PhoneField
              label="Phone Number"
              tabIndex={4}
              fullWidth
              error={errors?.phone ? true : false}
              helperText={
                errors?.phone ? 'A valid phone number with country code is required' : undefined
              }
              onChange={(phone, isValid) => {
                onChange({
                  number: phone,
                  isValid,
                })
              }}
              value={value?.number}
              {...restField}
            />
          )}
        />
      </React.Fragment>
    </Drawer>
  )
}
