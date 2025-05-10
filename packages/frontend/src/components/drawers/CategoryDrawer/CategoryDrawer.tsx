import DeleteIcon from '@mui/icons-material/Delete'
import MenuItem from '@mui/material/MenuItem'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { CategoryGroupField } from '@/components/forms/CategoryGroupField'
import { EmojiField } from '@/components/forms/EmojiField'
import { SelectField } from '@/components/forms/SelectField'
import { TextField } from '@/components/forms/TextField'
import type { IAccount, ICategoryGroup } from '@angelfish/core'
import { getCategoryTypeOptions } from '@angelfish/core'
import type { CategoryGroupType, CategoryType } from '@angelfish/core/src/types'
import type { CategoryDrawerProps } from './CategoryDrawer.interface'

/**
 * Form Properties
 */

type CategoryFormValues = {
  id?: number
  categoryGroupID?: number
  categoryGroupType: CategoryGroupType
  name: string
  description: string
  type: CategoryType
  icon: string
}

/**
 * Drawer for creating or editing a Category. If initialValue is provided, the drawer will be in edit mode,
 * otherwise will be in create mode, however if you pass in an initialValue with just categoryGroupID set you
 * can also set the initial Category Group for the new Category too.
 */
export default function CategoryDrawer({
  categoryGroups,
  initialValue,
  initialGroupType = 'Expense',
  open = true,
  onClose,
  onSave,
  onDelete,
}: CategoryDrawerProps) {
  // Setup Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<CategoryFormValues>({
    mode: 'onBlur',
  })

  /**
   * Make sure form is reset whenever initialValue is changed
   */
  React.useEffect(() => {
    if (open) {
      reset({
        id: initialValue?.id ?? undefined,
        categoryGroupID: initialValue?.cat_group_id,
        categoryGroupType: initialValue?.categoryGroup?.type ?? initialGroupType,
        name: initialValue?.name ?? '',
        description: initialValue?.cat_description ?? '',
        type: initialValue?.cat_type ?? ('' as CategoryType),
        icon: initialValue?.cat_icon ?? 'question',
      })
    }
  }, [initialValue, open, initialGroupType, reset])

  // Form Watchers
  const categoryGroupType = watch('categoryGroupType')

  /**
   * Get Category Type Options Based on Category Group Type
   */
  const typeOptions = useMemo(() => {
    return getCategoryTypeOptions(categoryGroupType)
  }, [categoryGroupType])

  /**
   * Handle updating or saving the Category
   */
  const handleSave = (formData: CategoryFormValues) => {
    const account = initialValue
      ? structuredClone(initialValue)
      : ({ class: 'CATEGORY' } as IAccount)
    account.name = formData.name
    account.cat_group_id = formData.categoryGroupID
    account.cat_description = formData.description
    account.cat_icon = formData.icon
    account.cat_type = formData.type
    onSave(account)
    onClose?.()
  }

  /**
   * Handle deleting the category
   */
  const handleDeleteCategory = () => {
    if (initialValue?.id) {
      onDelete(initialValue)
      onClose?.()
    }
  }

  return (
    <Drawer
      title={initialValue?.id ? 'Edit Category' : 'Create Category'}
      menuItems={
        initialValue?.id
          ? [
              {
                label: 'Delete Category',
                icon: DeleteIcon,
                onClick: handleDeleteCategory,
                color: 'error',
              },
            ]
          : undefined
      }
      {...{ open, onClose }}
      disableSaveButton={!isValid || !isDirty}
      onSave={() => handleSubmit(handleSave)()}
    >
      <React.Fragment>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="Name"
              fullWidth
              autoFocus
              required
              placeholder="E.g. Landscaping"
              error={errors?.name ? true : false}
              helperText={errors?.name ? 'A Category name is required' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              placeholder="E.g. Purchasing of materials, plants, or professional landscapers for your home garden."
              error={errors?.description ? true : false}
              helperText={errors?.description ? 'Invalid Description' : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="categoryGroupID"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, ...restField } }) => (
            <CategoryGroupField
              label="Group"
              required
              fullWidth
              categoryGroups={categoryGroups}
              onChange={(categoryGroup?: ICategoryGroup, prev?: ICategoryGroup) => {
                onChange(categoryGroup?.id)
                setValue('categoryGroupType', categoryGroup?.type ?? initialGroupType)
                if (prev?.type !== categoryGroup?.type) {
                  setValue('type', '' as CategoryType)
                }
              }}
              value={
                value
                  ? categoryGroups.find((categoryGroup) => categoryGroup.id === value)
                  : undefined
              }
              error={errors?.categoryGroupID ? true : false}
              helperText={errors?.categoryGroupID ? 'A Category Group is required' : undefined}
              {...restField}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, ...restField } }) => (
            <SelectField
              label="Type"
              fullWidth
              required
              onChange={(event) => {
                onChange(event.target.value as CategoryType)
              }}
              error={errors?.type ? true : false}
              helperText={errors?.type ? 'A Category Type is required' : undefined}
              {...restField}
            >
              {typeOptions.map(({ value }) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </SelectField>
          )}
        />

        <Controller
          name="icon"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <EmojiField
              label="Icon"
              fullWidth
              error={errors?.icon ? true : false}
              helperText={errors?.icon ? 'Invalid Icon' : undefined}
              {...field}
            />
          )}
        />
      </React.Fragment>
    </Drawer>
  )
}
