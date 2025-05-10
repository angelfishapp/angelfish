import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import React from 'react'

import type { SearchProps } from './Search.interface'
import { SearchContainer } from './Search.styles'

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
  // Keep reference to current value to determine search Icon to show
  const [currentValue, setCurrentValue] = React.useState<string>(value as string)

  // Render
  return (
    <SearchContainer hasShadow={hasShadow}>
      <InputBase
        className="searchInput"
        onChange={(event) => {
          setCurrentValue(event.target.value)
          onChange?.(event.target.value)
        }}
        value={currentValue}
        {...{ placeholder, ...props }}
        autoFocus={false}
      />
      <IconButton
        className="searchInputButton"
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
    </SearchContainer>
  )
}
