import { Drawer } from '@/components/Drawer'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { SwitchField } from '@/components/forms/SwitchField'
import type { CategorySpendReportQuery } from '@angelfish/core'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { TabPanel, Tabs } from '@/components/Tabs'
import { CategoryField } from '@/components/forms/CategoryField'
import type { CategoryType, IAccount, ITag } from '@angelfish/core'
import { allCategoryTypes } from '@angelfish/core'
import type { ReportsSettingsDrawerProps } from './ReportsSettingsDrawer.interface'
import { StyledAccordion, StyledAccordionSummary } from './ReportsSettingsDrawer.styles'
import { getFilterValues, isIncludeFilter } from './ReportsSettingsDrawer.utils'

/**
 * Form Properties
 */

type ReportSettingsFormValues = {
  include_unclassified: CategorySpendReportQuery['include_unclassified']
  include_categories: boolean
  categories: IAccount[]
  include_cat_types?: boolean
  category_types: CategoryType[]
  include_tags: boolean
  tags: ITag[]
  include_accounts?: boolean
  accounts: IAccount[]
}

/**
 * Reports Settings Drawer: opens right side drawer to allow user to modify the report
 * settings
 */
export default function ReportsSettingsDrawer({
  accountsWithRelations,
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
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<ReportSettingsFormValues>({
    mode: 'onBlur',
  })

  const selectedCategoriesCount = watch('categories')?.length || 0
  const selectedCategoryTypesCount = watch('category_types')?.length || 0

  /**
   * Make sure form is reset whenever drawer is opened
   */
  React.useEffect(() => {
    if (open) {
      reset({
        include_unclassified: initialQuery.include_unclassified,
        include_categories: isIncludeFilter(initialQuery.category_ids),
        categories: getFilterValues(initialQuery.category_ids).map((categoryId) => {
          return accountsWithRelations.find((account) => account.id === categoryId)
        }),
        include_cat_types: isIncludeFilter(initialQuery.category_types),
        category_types: getFilterValues(initialQuery.category_types),
        include_tags: isIncludeFilter(initialQuery.tag_ids),
        tags: getFilterValues(initialQuery.tag_ids).map((tagId) => {
          return tags.find((tag) => tag.id === tagId)
        }),
        include_accounts: isIncludeFilter(initialQuery.account_ids),
        accounts: getFilterValues(initialQuery.account_ids).map((accountId) => {
          return accountsWithRelations.find((account) => account.id === accountId)
        }),
      })
    }
  }, [open, reset, initialQuery, tags, accountsWithRelations])

  /**
   * Handle updating the report query
   */
  const handleSave = (formData: ReportSettingsFormValues) => {
    const reportQuery = structuredClone(initialQuery)
    reportQuery.include_unclassified = formData.include_unclassified
    reportQuery.category_ids = formData.include_categories
      ? { include: formData.categories.map((category) => category.id) }
      : { exclude: formData.categories.map((category) => category.id) }
    reportQuery.category_types = formData.include_cat_types
      ? { include: formData.category_types }
      : { exclude: formData.category_types }
    reportQuery.tag_ids = formData.include_tags
      ? { include: formData.tags.map((tag) => tag.id) }
      : { exclude: formData.tags.map((tag) => tag.id) }
    reportQuery.account_ids = formData.include_accounts
      ? { include: formData.accounts.map((account) => account.id) }
      : { exclude: formData.accounts.map((account) => account.id) }
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
          <Tabs id="category-tabs" aria-label="Category Tabs">
            <TabPanel index={0} label={`Categories (${selectedCategoriesCount})`}>
              <Controller
                name="categories"
                control={control}
                rules={{ required: false }}
                render={({ field }) => {
                  return (
                    <CategoryField
                      label="Selected Categories"
                      variant="multiselect"
                      fullWidth
                      maxHeight={250}
                      placeholder="Search Categories..."
                      error={errors?.categories ? true : false}
                      helperText="Unselect all Categories to remove the filter"
                      accountsWithRelations={accountsWithRelations}
                      filter={(account) => account.class === 'CATEGORY'}
                      {...field}
                    />
                  )
                }}
              />
              <Controller
                name="include_categories"
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
                        ? 'Only include Transactions in selected Categories'
                        : 'Exclude Transactions in selected Categories'
                    }
                    error={errors?.include_categories ? true : false}
                    value={value}
                    {...restField}
                  />
                )}
              />
            </TabPanel>
            <TabPanel index={1} label={`Category Types (${selectedCategoryTypesCount})`}>
              <Controller
                name="category_types"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, value }, ...restField }) => {
                  return (
                    <MultiSelectField
                      label="Selected Category Types"
                      fullWidth
                      placeholder="Search Category Types..."
                      error={errors?.category_types ? true : false}
                      helperText="Unselect all Category Types to remove the filter"
                      options={allCategoryTypes}
                      groupBy={(option) => option.groupType}
                      maxHeight={250}
                      getOptionKey={(option) => {
                        return option.type
                      }}
                      getOptionLabel={(option) => {
                        return option.type
                      }}
                      isOptionEqualToValue={(option, value) => {
                        return option.type === value.type
                      }}
                      onChange={(_event, newValue) => {
                        const catTypes = newValue.map((catType) => catType.type)
                        onChange(catTypes)
                      }}
                      value={
                        value
                          ? allCategoryTypes.filter((catType) =>
                              value.some((selectedType) => selectedType === catType.type),
                            )
                          : []
                      }
                      {...restField}
                    />
                  )
                }}
              />
              <Controller
                name="include_cat_types"
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
                        ? 'Only include Transactions with selected Category Types'
                        : 'Exclude Transactions with selected Category Types'
                    }
                    error={errors?.include_cat_types ? true : false}
                    value={value}
                    {...restField}
                  />
                )}
              />
            </TabPanel>
          </Tabs>
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
                  maxHeight={250}
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
      <StyledAccordion>
        <StyledAccordionSummary aria-controls="tags-content" id="tags-header">
          <Typography component="span" fontWeight="bold">
            Accounts
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Controller
            name="accounts"
            control={control}
            rules={{ required: false }}
            render={({ field }) => {
              return (
                <CategoryField
                  label="Selected Accounts"
                  variant="multiselect"
                  fullWidth
                  maxHeight={250}
                  disableTooltip={true}
                  placeholder="Search Accounts..."
                  error={errors?.accounts ? true : false}
                  helperText="Unselect all Accounts to remove the filter"
                  accountsWithRelations={accountsWithRelations}
                  groupBy={(account) => account.institution?.name || 'Unknown'}
                  filter={(account) => account.class === 'ACCOUNT'}
                  {...field}
                />
              )
            }}
          />
          <Controller
            name="include_accounts"
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
                    ? 'Only include Transactions in selected Accounts'
                    : 'Exclude Transactions in selected Accounts'
                }
                error={errors?.include_accounts ? true : false}
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
