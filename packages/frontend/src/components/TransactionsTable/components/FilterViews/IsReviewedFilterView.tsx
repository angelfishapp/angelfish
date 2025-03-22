import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { SwitchField } from '@/components/forms/SwitchField'
import type { FilterViewProps } from './FilterView.interface'

/**
 * Main Filter View Component for is_reviewed Column
 */
export default function IsReviewedFilterView({ column, onClose }: FilterViewProps) {
  const filterValue = column.getFilterValue() as boolean | undefined

  return (
    <Box width={250}>
      <Box paddingTop={2}>
        <Grid container spacing={0}>
          <Grid item xs={6} sx={{ paddingLeft: 1, alignItems: 'center' }}>
            <strong>Is Reviewed?</strong>
          </Grid>
          <Grid item xs={6}>
            <SwitchField value={filterValue} onChange={(value) => column.setFilterValue(value)} />
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box padding={1}>
        <Button
          fullWidth
          onClick={() => {
            column.setFilterValue(undefined)
            onClose()
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}
