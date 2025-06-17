'use client'

import type { IAccount, IInstitution, ITag } from '@angelfish/core'
import { Box, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import MultiSelect from './components/MultiSelect'
import type { MultiSelectFieldProps } from './MultiSelectField.interface'

/**
 * Autocomplete Field for selecting a Category or Account
 */

export default React.forwardRef<
  HTMLDivElement,
  // this line should be generic
  MultiSelectFieldProps<IInstitution | IAccount | ITag>
>(function Multiselectfield(
  {
    value,
    data,
    disableTooltip = false,
    disableGroupBy = false,
    onChange,
    id = 'multi-select-field',
    label,
    placeholder,
    ...formFieldProps
  }: MultiSelectFieldProps<IInstitution | IAccount | ITag>,
  ref,
) {
  // Render

  // Render
  return (
    <Container id={id} maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {label} Selection
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <MultiSelect
            formRef={ref}
            label={label}
            options={data}
            value={value}
            disableTooltip={disableTooltip}
            onChange={(newValue) => onChange?.(newValue as Array<IInstitution | IAccount | ITag>)}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            groupBy={
              !disableGroupBy
                ? (option) => {
                  if ('class' in option && option.class === 'CATEGORY') {
                    if (option.id != 0) {
                      return option.categoryGroup?.name ? String(option.categoryGroup.name) : ''
                    }
                    return ''
                  } else if (label !== 'Categories') return String(label)
                  return 'Account Transfer'
                }
                : undefined
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            placeholder={placeholder}
            maxHeight={400}
            {...formFieldProps}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Selected {label} ({value?.length})
            </Typography>

            {value?.length > 0 ? (
              <Box component="ul" sx={{ pl: 2 }}>
                {value?.map((item: IAccount | IInstitution | ITag) => (
                  <Typography component="li" key={item.id}>
                    {item.name} {(item as IAccount).categoryGroup?.name}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No {label} selected</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  )
})
