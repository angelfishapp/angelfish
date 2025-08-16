import DeleteIcon from '@mui/icons-material/Delete'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { ColorField } from '@/components/forms/ColorField'
import { EmojiField } from '@/components/forms/EmojiField'
import { SelectField } from '@/components/forms/SelectField'
import { TextField } from '@/components/forms/TextField'
import type { CategoryGroupType, ICategoryGroup } from '@angelfish/core'
import { getCategoryGroupTypeOptions } from '@angelfish/core'
import type { CategoryGroupDrawerProps } from './CategoryGroupDrawer.interface'
import { useTranslate } from '@/utils/i18n'

/**
 * Form Properties
 */

type CategoryGroupFormValues = {
  name: string
  description: string
  type: CategoryGroupType
  icon: string
  color: string
}

/**
 * Right hand drawer for creating or editing a Category Group. If a categoryGroup is provided, the drawer will be in edit mode,
 * otherwise will be in create mode.
 */

export default function CategoryGroupDrawer({
  categoryGroup,
  onClose,
  onSave,
  onDelete,
  open = true,
}: CategoryGroupDrawerProps) {
  const { CategoryGroupDrawer: t } = useTranslate('components.drawers')
  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CategoryGroupFormValues>({
    mode: 'onBlur',
  })

  /**
   * Make sure form is reset whenever categoryGroup is changed
   */
  React.useEffect(() => {
    if (open) {
      if (categoryGroup) {
        reset({
          name: categoryGroup.name,
          description: categoryGroup.description,
          type: categoryGroup.type,
          icon: categoryGroup.icon,
          color: categoryGroup.color ?? '',
        })
      } else {
        reset({
          name: '',
          description: '',
          type: '' as CategoryGroupType,
          icon: 'question',
          color: '',
        })
      }
    }
  }, [categoryGroup, open, reset])

  // Create Group Type Options
  const groupTypeOptions = getCategoryGroupTypeOptions()

  /**
   * Handle updating or saving the Category Group
   */
  const handleSave = (formData: CategoryGroupFormValues) => {
    const savedCategoryGroup = categoryGroup
      ? structuredClone(categoryGroup)
      : ({} as ICategoryGroup)

    savedCategoryGroup.name = formData.name
    savedCategoryGroup.type = formData.type
    savedCategoryGroup.description = formData.description
    savedCategoryGroup.icon = formData.icon ? formData.icon : 'question'
    savedCategoryGroup.color = formData.color ? formData.color : undefined
    onSave(savedCategoryGroup)
  }

  /**
   * Handle Deleting the Category Group
   */
  const handleDeleteGroup = () => {
    if (categoryGroup) {
      onDelete(categoryGroup)
      onClose?.()
    }
  }

  return (
    <Drawer
      title={categoryGroup ? t['edit'] : t['create']}
      menuItems={
        categoryGroup
          ? [
            {
              label: t['delete'],
              icon: DeleteIcon,
              onClick: handleDeleteGroup,
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
              label={t["name"]}
              fullWidth
              autoFocus
              required
              placeholder={t["namePlaceholder"]}
              error={errors?.name ? true : false}
              helperText={errors?.name ? t["errorName"] : undefined}
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
              label={t['description']}
              fullWidth
              multiline
              rows={3}
              placeholder={t['descriptionPlaceholder']}
              error={errors?.description ? true : false}
              helperText={errors?.description ? t['errorDescription'] : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, ...restField } }) => (
            <SelectField
              label={t['type']}
              fullWidth
              required
              onChange={(event) => {
                onChange(event.target.value as CategoryGroupType)
              }}
              error={errors?.type ? true : false}
              helperText={errors?.type ? t['errorType'] : undefined}
              {...restField}
            >
              {groupTypeOptions.map(({ value }) => (
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
              label={t['icon']}
              fullWidth
              error={errors?.icon ? true : false}
              helperText={errors?.icon ? t['errorIcon'] : undefined}
              {...field}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <ColorField
              label={t['color']}
              fullWidth
              error={errors?.color ? true : false}
              helperText={errors?.color ? t['errorColor'] : undefined}
              {...field}
            />
          )}
        />
      </React.Fragment>
    </Drawer>
  )
}
