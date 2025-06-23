import type {
  AutocompleteRenderGroupParams,
  AutocompleteRenderOptionState,
} from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import type React from 'react'

import type { MultiSelectFieldOwnerState } from './MultiSelectField.interface'

/**
 * Default function to get the label of an option in the MultiSelectField component.
 *
 * @param option    The option to get the label from.
 * @returns         The label of the option.
 */
export function defaultGetOptionLabel<Value>(option: Value): string {
  return (option as any).label ?? String(option)
}

/**
 * Default render function for group headers in the MultiSelectField component.
 * @param params    The parameters for the group.
 * @returns         The rendered group header.
 */
export function renderGroup<Value>(
  params: AutocompleteRenderGroupParams,
  options: Value[],
  { selectedValues, onChange, isOptionEqualToValue }: MultiSelectFieldOwnerState<Value>,
): React.ReactNode {
  // Check if group is selected or partially selected
  const isGroupSelected = options.every((option) =>
    selectedValues.some((value) => isOptionEqualToValue(option, value)),
  )
  const isGroupPartiallySelected =
    !isGroupSelected &&
    options.some((option) => selectedValues.some((value) => isOptionEqualToValue(option, value)))

  return (
    <li key={params.key}>
      <ListSubheader component="div">
        {' '}
        <Checkbox
          checked={isGroupSelected}
          indeterminate={isGroupPartiallySelected}
          onClick={(event) => {
            // Add or remove all options in the group
            const newOptions = [...selectedValues]
            const details: Value[] = []
            options.forEach((option) => {
              if (!isGroupSelected) {
                if (!selectedValues.some((value) => isOptionEqualToValue(option, value))) {
                  newOptions.push(option)
                  details.push(option)
                }
              } else if (selectedValues.some((value) => isOptionEqualToValue(option, value))) {
                details.push(option)
                newOptions.splice(newOptions.indexOf(option), 1)
              }
            })
            onChange?.(event, newOptions, isGroupSelected ? 'removeGroup' : 'selectGroup', details)
          }}
        />
        {params.group}
      </ListSubheader>
      <ul>{params.children}</ul>
    </li>
  )
}

/**
 * Default render function for options in the MultiSelectField component.
 *
 * @param props         The props to apply on the li element.
 * @param option        The option to render.
 * @param state         The state of the option.
 * @param ownerState    The owner state of the MultiSelectField.
 * @returns             The rendered option.
 *
 */
export function renderListOption<Value>(
  props: React.HTMLAttributes<HTMLLIElement> & { key: any },
  option: Value,
  { selected }: AutocompleteRenderOptionState,
  { renderOption }: MultiSelectFieldOwnerState<Value>,
): React.ReactNode {
  const { key, ...otherProps } = props
  return (
    <ListItem key={key} {...otherProps} sx={{ cursor: 'pointer' }}>
      <Checkbox checked={selected} />
      {renderOption(option)}
    </ListItem>
  )
}
