import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import React from 'react'

import type { SearchProps } from './Search.interface'
import { useStyles } from './Search.styles'

/**
 * Provides Styled Search Input Field
 */
export default function Search({
  placeholder = 'Search...',
  hasShadow = true,
  onChange,
  value,
  ...props
}: SearchProps) {
  const classes = useStyles({ hasShadow })

  // Keep reference to current value to determine search Icon to show
  const [currentValue, setCurrentValue] = React.useState<string>(value as string)

  // Render
  return (
    <Box display="flex" className={classes.searchInputWrapper}>
      <InputBase
        className={classes.searchInput}
        onChange={(event) => {
          setCurrentValue(event.target.value)
          onChange?.(event.target.value)
        }}
        value={currentValue}
        {...{ placeholder, ...props }}
        autoFocus={false}
      />
      <IconButton
        className={classes.searchInputButton}
        size="large"
        onClick={() => {
          if (currentValue) {
            setCurrentValue('')
            onChange?.('')
          }
        }}
      >
        {currentValue ? <SearchOffIcon /> : <SearchIcon />}
      </IconButton>
    </Box>
  )
}
