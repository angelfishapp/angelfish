'use client'

import type { IAccount } from '@angelfish/core'
import { Box, Container, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import type { MultiSelectFieldProps } from './MultiSelectField.interface'
import MultiSelect from './components/MultiSelect'
import { RenderOption } from './components/RenderOption'

/**
 * Autocomplete Field for selecting a Category or Account
 */

export default React.forwardRef<HTMLDivElement, MultiSelectFieldProps>(function MultiSelectField({
  accountsWithRelations,
  disableTooltip = false,
  disableGroupBy = false,
}: MultiSelectFieldProps) {
  // states to handle multi-select variant
  const [selected, setSelected] = useState<IAccount[]>([])

  // Render
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Category Selection
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <MultiSelect
            options={accountsWithRelations}
            value={selected}
            onChange={(_event, newValue) => setSelected(newValue)}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            groupBy={
              !disableGroupBy
                ? (option) => {
                    if (option.class == 'CATEGORY') {
                      if (option.id != 0) {
                        return option.categoryGroup?.name ?? ''
                      }
                      return ''
                    }
                    return 'Account Transfer'
                  }
                : undefined
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            placeholder="Search categories..."
            maxHeight={400}
            renderOption={(props, option) => (
              <RenderOption
                props={props}
                option={option}
                selected={selected}
                setSelected={setSelected}
                disableTooltip={disableTooltip}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Selected Categories ({selected.length})
            </Typography>

            {selected.length > 0 ? (
              <Box component="ul" sx={{ pl: 2 }}>
                {selected.map((category) => (
                  <Typography component="li" key={category.id}>
                    {category.name} ({category.categoryGroup?.name})
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No categories selected</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  )
})
