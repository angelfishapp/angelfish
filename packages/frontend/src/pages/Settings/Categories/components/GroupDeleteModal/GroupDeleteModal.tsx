import { Controller, useForm } from 'react-hook-form'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CategoryGroupField } from '@/components/forms/CategoryGroupField'
import type { ICategoryGroup } from '@angelfish/core'
import type { GroupDeleteModalProps } from './GroupDeleteModal.interfaces'

/**
 * Form Properties
 */
type DeleteGroupFormValues = {
  groupId?: number
}

/**
 * Modal to confirm deletion of a category group. If the group has categories in it, it will ask
 * which other group of same type (INCOME or EXPENSE) to assign them to.
 */
export default function GroupDeleteModal({
  categoryGroup,
  accounts,
  options,
  onConfirm,
  onClose,
  ...rest
}: GroupDeleteModalProps) {
  // Form Setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<DeleteGroupFormValues>({
    mode: 'onBlur',
    defaultValues: { groupId: undefined },
  })

  // Render
  return (
    <ConfirmDialog
      {...rest}
      title="Delete Category Group"
      cancelText="Cancel"
      onConfirm={handleSubmit((formValues: DeleteGroupFormValues) =>
        onConfirm(
          (accounts ?? []).map((account) => ({ ...account, categoryGroupID: formValues.groupId })),
        ),
      )}
      confirmButtonDisabled={accounts && !isValid}
      confirmText="Delete"
      onClose={() => {
        reset()
        onClose?.()
      }}
      open
    >
      <p>Are you sure you want to delete this Category Group?</p>

      {!!accounts?.length && (
        <>
          <p>
            This group has {accounts.length} categories in it. Please select which Category Group
            you would like to move them too.
          </p>
          <div>
            <Controller
              name="groupId"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, ...restField } }) => (
                <CategoryGroupField
                  label="New Category Group"
                  required
                  fullWidth
                  value={
                    value ? options?.find((categoryGroup) => categoryGroup.id === value) : undefined
                  }
                  categoryGroups={options?.filter((group) => group.id !== categoryGroup.id)}
                  onChange={(value?: ICategoryGroup, _prev?: ICategoryGroup) => onChange(value?.id)}
                  error={errors.groupId ? true : false}
                  helperText={errors.groupId ? 'A Category Group is required' : undefined}
                  {...restField}
                />
              )}
            />
          </div>
        </>
      )}
    </ConfirmDialog>
  )
}
