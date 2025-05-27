import type { IAccount } from '@angelfish/core'
import { FilterList as FilterListIcon } from '@mui/icons-material'
import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type React from 'react'

/**
 * Props for the MultiSelectFieldHeader component.
 */
type MultiSelectFieldHeaderProps = {
  /**
   * The currently selected accounts.
   * Each item in the array is an IAccount object.
   */
  selected: IAccount[]

  /**
   * Callback to clear all selected accounts.
   */
  handleClearAll: () => void

  /**
   * Current filter mode used to control selection behavior.
   * - "all": show all accounts
   * - "include": show only selected accounts
   * - "exclude": show all except selected accounts
   */
  filterMode: 'all' | 'include' | 'exclude'

  /**
   * Callback to update the filter mode.
   *
   * @param event - The mouse event triggered by the user interaction.
   * @param newFilterMode - The new filter mode to apply.
   */
  handleFilterModeChange: (
    event: React.MouseEvent<HTMLElement>,
    newFilterMode: 'all' | 'include' | 'exclude',
  ) => void
}

export const MultiSelectFieldHeader: React.FC<MultiSelectFieldHeaderProps> = ({
  selected,
  handleClearAll,
  filterMode,
  handleFilterModeChange,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          {selected.length} selected
        </Typography>
        {selected.length > 0 && (
          <Chip label="Clear all" size="small" onClick={handleClearAll} variant="outlined" />
        )}
      </Box>
      {/* Include/Exclude filter toggle */}
      {selected.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <ToggleButtonGroup
            size="small"
            value={filterMode}
            exclusive
            onChange={handleFilterModeChange}
            aria-label="filter mode"
          >
            <ToggleButton value="all" aria-label="show all">
              All
            </ToggleButton>
            <ToggleButton value="include" aria-label="include selected">
              Include
            </ToggleButton>
            <ToggleButton value="exclude" aria-label="exclude selected">
              Exclude
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  )
}
export default MultiSelectFieldHeader
