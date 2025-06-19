import { Drawer } from '@/components/Drawer'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { SwitchField } from '@/components/forms/SwitchField'
import type { CategorySpendReportQuery } from '@angelfish/core'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ITag } from '@angelfish/core'
import type { ReportsSettingsDrawerProps } from './ReportsSettingsDrawer.interface'
import { StyledAccordion, StyledAccordionSummary } from './ReportsSettingsDrawer.styles'
import { getFilterValues, isIncludeFilter } from './ReportsSettingsDrawer.utils'

/**
 * Form Properties
 */

type ReportSettingsFormValues = {
  include_unclassified: CategorySpendReportQuery['include_unclassified']
  include_tags: boolean
  tags: ITag[]
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
  tags,
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
        include_tags: isIncludeFilter(initialQuery.tag_ids),
        tags: getFilterValues(initialQuery.tag_ids).map((tagId) => {
          return tags.find((tag) => tag.id === tagId)
        }),
      })
    }
  }, [open, reset, initialQuery, tags])

  /**
   * Handle updating the report query
   */
  const handleSave = (formData: ReportSettingsFormValues) => {
    const reportQuery = structuredClone(initialQuery)
    reportQuery.include_unclassified = formData.include_unclassified
    reportQuery.tag_ids = formData.include_tags
      ? { include: formData.tags.map((tag) => tag.id) }
      : { exclude: formData.tags.map((tag) => tag.id) }
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
      <StyledAccordion>
        <StyledAccordionSummary aria-controls="categories-content" id="categories-header">
          <Typography component="span" fontWeight="bold">
            Categories
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion>
        <StyledAccordionSummary aria-controls="tags-content" id="tags-header">
          <Typography component="span" fontWeight="bold">
            Tags
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Controller
            name="tags"
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, value }, ...restField }) => {
              return (
                <MultiSelectField
                  label="Selected Tags"
                  fullWidth
                  placeholder="Search Tags..."
                  error={errors?.tags ? true : false}
                  helperText="Unselect all Tags to remove the filter"
                  options={tags}
                  maxHeight={200}
                  getOptionKey={(option) => {
                    return option.id
                  }}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id
                  }}
                  onChange={(_event, newValue) => {
                    onChange(newValue)
                  }}
                  value={value}
                  {...restField}
                />
              )
            }}
          />
          <Controller
            name="include_tags"
            control={control}
            rules={{ required: false }}
            render={({ field: { value, ...restField } }) => (
              <SwitchField
                leftLabel="Exclude"
                rightLabel="Include"
                fullWidth
                checkedColor="success"
                margin="dense"
                helperText={
                  value
                    ? 'Only include Transactions with selected Tags'
                    : 'Exclude Transactions with selected Tags'
                }
                error={errors?.include_tags ? true : false}
                value={value}
                {...restField}
              />
            )}
          />
        </AccordionDetails>
      </StyledAccordion>
    </Drawer>
  )
}
