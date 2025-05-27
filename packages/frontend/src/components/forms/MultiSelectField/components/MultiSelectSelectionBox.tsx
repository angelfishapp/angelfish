import { Box, Paper, Typography } from '@mui/material'
import type React from 'react'

import type { IAccount } from '@angelfish/core'

/**
 * Props for the MultiSelectSelectionBox component.
 */
type MultiSelectSelectionBoxProps = {
  /**
   * The list of currently selected accounts.
   * Each item is an IAccount object.
   */
  selected: IAccount[]
}

export const MultiSelectSelectionBox: React.FC<MultiSelectSelectionBoxProps> = ({ selected }) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Selected Categories ({selected.length})
        </Typography>
        {selected.length > 0 ? (
          <Box component="ul" sx={{ pl: 2 }}>
            {selected.map((item) => (
              <Typography component="li" key={item.id}>
                {item.name}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No categories selected</Typography>
        )}
      </Paper>
    </Box>
  )
}
export default MultiSelectSelectionBox
