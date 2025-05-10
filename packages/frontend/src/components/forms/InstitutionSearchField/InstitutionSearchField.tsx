import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'

import { BankIcon } from '@/components/BankIcon'
import { AutocompleteField } from '@/components/forms/AutocompleteField'
import type { IInstitutionUpdate } from '@angelfish/core'
import type { InstitutionSearchFieldProps } from './InstitutionSearchField.interface'

/**
 * Provides search component to asynchronously search API for an Institution that can be added to
 * Angelfish
 */
export default React.forwardRef<HTMLDivElement, InstitutionSearchFieldProps>(
  function InstitutionSearchField(
    {
      onChange,
      onSearch,
      value,
      id = 'institution-search-field',
      placeholder = 'Type in Institution Name...',
      ...formFieldProps
    }: InstitutionSearchFieldProps,
    ref,
  ) {
    // Component State
    const [query, setQuery] = React.useState<string>('')
    const [searchResults, setSearchResults] = React.useState<IInstitutionUpdate[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isOpen, setIsOpen] = React.useState<boolean>(false)
    const [skipQuery, setSkipQuery] = React.useState<boolean>(false)

    /**
     * Update search results as query changes
     */
    React.useEffect(() => {
      if (query && !skipQuery) {
        // Run async search
        setIsLoading(true)
        setIsOpen(true)
        onSearch(query)
          .then((results) => {
            setSearchResults(results)
            setIsLoading(false)
            setIsOpen(results.length > 0)
          })
          .catch((error) => {
            /* eslint-disable no-console */
            console.error(error)
            /* eslint-enable no-console */
            setSearchResults([])
            setIsLoading(false)
            setIsOpen(false)
          })
      } else {
        setSearchResults([])
        setIsOpen(false)
      }
    }, [query, skipQuery, onSearch])

    // Render
    return (
      <AutocompleteField
        id={id}
        formRef={ref}
        freeSolo={true}
        multiple={false}
        options={searchResults}
        loading={isLoading}
        placeholder={placeholder}
        autoHighlight
        selectOnFocus
        open={isOpen}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          return option.name
        }}
        renderOption={(props, option: IInstitutionUpdate) => {
          const { key, ...rest } = props
          // Use current string value
          if (option.id === -1) {
            return (
              <ListItem key={key} {...rest}>
                <ListItemText primary={`Use ${option.name}`} />
              </ListItem>
            )
          }
          // Render search result
          return (
            <ListItem key={key} {...rest}>
              <ListItemIcon>
                <BankIcon logo={option.logo} />
              </ListItemIcon>
              <ListItemText
                primary={option.name}
                secondary={option.url}
                secondaryTypographyProps={{
                  noWrap: true,
                }}
              />
            </ListItem>
          )
        }}
        inputValue={value}
        onInputChange={(_, newInputValue) => {
          onChange?.(newInputValue)
          if (!skipQuery) {
            setQuery(newInputValue)
          } else {
            // Reset Skip Query
            setSkipQuery(false)
          }
        }}
        noOptionsText={isLoading ? 'Loading...' : 'No Results'}
        filterOptions={(options) => {
          options.push({ id: -1, name: query, country: '' })
          return options
        }}
        onChange={(_, newValue) => {
          setIsOpen(false)
          setSkipQuery(true)
          if (typeof newValue === 'string') {
            onChange?.(newValue)
            return
          }
          if (newValue) {
            if (newValue.id === -1) {
              // Use current string value
              onChange?.(newValue.name)
              return
            }
            // Use selected value
            onChange?.(newValue.name, newValue)
          }
        }}
        {...formFieldProps}
      />
    )
  },
)
