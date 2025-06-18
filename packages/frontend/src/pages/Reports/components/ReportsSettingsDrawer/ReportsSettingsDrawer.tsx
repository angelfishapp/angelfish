import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Drawer } from '@/components/Drawer'
import { SwitchField } from '@/components/forms/SwitchField'
import type { CategorySpendReportQuery } from '@angelfish/core'
import type { ReportsSettingsDrawerProps } from './ReportsSettingsDrawer.interface'

/**
 * Form Properties
 */

type ReportSettingsFormValues = {
  include_unclassified: CategorySpendReportQuery['include_unclassified']
}

/**
 * Reports Settings Drawer: opens right side drawer to allow user to modify the report
 * settings
 */
export default function ReportsSettingsDrawer({
  initialQuery,
  open,
  onClose,
  onSave,
}: ReportsSettingsDrawerProps) {
  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ReportSettingsFormValues>({
    mode: 'onBlur',
  })

  /**
   * Make sure form is reset whenever drawer is opened
   */
  React.useEffect(() => {
    if (open) {
      reset({
        include_unclassified: initialQuery.include_unclassified,
      })
    }
  }, [open, reset, initialQuery.include_unclassified])

  /**
   * Handle updating the report query
   */
  const handleSave = (formData: ReportSettingsFormValues) => {
    const reportQuery = structuredClone(initialQuery)
    reportQuery.include_unclassified = formData.include_unclassified
    onSave(reportQuery)
    onClose()
  }

  // Render
  return (
    <Drawer
      title="Report Settings"
      onClose={onClose}
      open={open}
      disableSaveButton={!isValid || !isDirty}
      onSave={() => handleSubmit(handleSave)()}
    >
      <Controller
        name="include_unclassified"
        control={control}
        rules={{ required: false }}
        render={({ field }) => (
          <SwitchField
            label="Include Unclassified Transactions"
            fullWidth
            error={errors?.include_unclassified ? true : false}
            helperText="Include or Exclude transactions that have not been classified"
            {...field}
          />
        )}
      />
    </Drawer>
  )
}
