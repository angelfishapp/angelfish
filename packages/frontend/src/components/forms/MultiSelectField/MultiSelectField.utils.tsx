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
export function renderGroup(params: AutocompleteRenderGroupParams): React.ReactNode {
  return (
    <li key={params.key}>
      <ListSubheader component="div">
        {' '}
        <Checkbox checked={false} />
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
  state: AutocompleteRenderOptionState,
  ownerState: MultiSelectFieldOwnerState<Value>,
): React.ReactNode {
  const { key, ...otherProps } = props
  return (
    <ListItem key={key} {...otherProps}>
      <Checkbox checked={state.selected} />
      {ownerState.renderOption(option)}
    </ListItem>
  )
}
