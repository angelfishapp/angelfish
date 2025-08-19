import { Controller, useForm } from 'react-hook-form'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CategoryField } from '@/components/forms/CategoryField'
import { useTranslate } from '@/utils/i18n'
import type { CategoryDeleteModalProps } from './CategoryDeleteModal.interface'

/**
 * Form Properties
 */
type DeleteCategoryFormValues = {
  accountId?: number
}

/**
 * Confirm Category Delete Modal. If the Category has transactions assigned to it, will ask user
 * to re-assign transactions to another category or leave unclassified. If no transactions are assigned
 * to the category, will just ask simple confirmation.
 */
export default function CategoryDeleteModal({
  account,
  onConfirm,
  onClose,
  options,
  transactions,
  ...rest
}: CategoryDeleteModalProps) {
  const { settings: t } = useTranslate('pages')

  // Form Setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteCategoryFormValues>({
    defaultValues: { accountId: undefined },
  })

  return (
    <ConfirmDialog
      {...rest}
      title={`${['Delete Category:']} ${account.name}`}
      cancelText={t['Cancel']}
      confirmText={t['confirm']}
      onConfirm={handleSubmit((formValues: DeleteCategoryFormValues) =>
        onConfirm(account.id, formValues.accountId),
      )}
      open
      onClose={() => {
        reset()
        onClose?.()
      }}
    >
      <p>{t['Are you sure you want to delete this Category?']}</p>

      {!!transactions?.length && (
        <>
          <p>
            {t['This Category has ']}
            {transactions.length}{' '}
            {
              t[
                'Transactions in it. You can select which Category to re-assign them to or select nothing to leave them unclassified.'
              ]
            }
          </p>
          <div>
            <Controller
              name="accountId"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange, ...field } }) => (
                <CategoryField
                  label={t['Re-Assign Transactions Category']}
                  margin="none"
                  value={value ? options.find((x) => x.id === value) : undefined}
                  accountsWithRelations={options?.filter((group) => group.id !== account.id)}
                  onChange={(account) => {
                    if (!account) return onChange(undefined)
                    if (typeof account === 'object') return onChange(account.id)
                  }}
                  renderAsValue={false}
                  onCreate={() => {
                    return
                  }}
                  fullWidth
                  error={errors.accountId ? true : false}
                  helperText={errors.accountId ? t['Invalid Category Selected'] : undefined}
                  {...field}
                />
              )}
            />
          </div>
        </>
      )}
    </ConfirmDialog>
  )
}
