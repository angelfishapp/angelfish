import type {
  AutocompleteChangeReason,
  AutocompleteCloseReason,
  AutocompleteGetTagProps,
  AutocompleteHighlightChangeReason,
  AutocompleteInputChangeReason,
  AutocompleteValue,
  FilterOptionsState,
  AutocompleteFreeSoloValueMapping,
} from '@mui/base/useAutocomplete'
import type {
  AutocompleteChangeDetails,
  AutocompleteRenderGroupParams,
  AutocompleteRenderOptionState,
} from '@mui/material/Autocomplete'

import type { FormFieldProps } from '../FormField'

/**
 * AutocompleteField Component Properties
 */

export interface AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends FormFieldProps {
  /**
   * If `true`, the portion of the selected suggestion that has not been typed by the user,
   * known as the completion string, appears inline after the input cursor in the textbox.
   * The inline completion string is visually highlighted and has a selected state.
   * @default false
   */
  autoComplete?: boolean
  /**
   * If `true`, the first option is automatically highlighted.
   * @default false
   */
  autoHighlight?: boolean
  /**
   * If `true`, the selected option becomes the value of the input
   * when the Autocomplete loses focus unless the user chooses
   * a different option or changes the character string in the input.
   * @default false
   */
  autoSelect?: boolean
  /**
   * Control if the input should be blurred when an option is selected:
   *
   * - `false` the input is not blurred.
   * - `true` the input is always blurred.
   * - `touch` the input is blurred after a touch event.
   * - `mouse` the input is blurred after a mouse event.
   * @default false
   */
  blurOnSelect?: boolean
  /**
   * If `true`, the input's text is cleared on blur if no value is selected.
   *
   * Set to `true` if you want to help the user enter a new value.
   * Set to `false` if you want to help the user resume his search.
   * @default !props.freeSolo
   */
  clearOnBlur?: boolean
  /**
   * If `true`, clear all values when the user presses escape and the popup is closed.
   * @default false
   */
  clearOnEscape?: boolean
  /**
   * The default value. Use when the component is not controlled.
   * @default props.multiple ? [] : null
   */
  defaultValue?: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
  /**
   * If `true`, the input can't be cleared.
   * @default false
   */
  disableClearable?: DisableClearable
  /**
   * If `true`, the popup won't close when a value is selected.
   * @default false
   */
  disableCloseOnSelect?: boolean
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean
  /**
   * If `true`, the list box in the popup will not wrap focus.
   * @default false
   */
  disableListWrap?: boolean
  /**
   * A filter function that determines the options that are eligible.
   *
   * @param {T[]} options The options to render.
   * @param {object} state The state of the component.
   * @returns {T[]}
   */
  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[]
  /**
   * If `true`, hide the selected options from the list box.
   * @default false
   */
  filterSelectedOptions?: boolean
  /**
   * Forwarded reference for FormField Control
   */
  formRef?: React.Ref<HTMLDivElement>
  /**
   * If `true`, the Autocomplete is free solo, meaning that the user input is not bound to provided options.
   * @default false
   */
  freeSolo?: FreeSolo
  /**
   * Used to determine the disabled state for a given option.
   *
   * @param {T} option The option to test.
   * @returns {boolean}
   */
  getOptionDisabled?: (option: T) => boolean
  /**
   * Used to determine the string value for a given option.
   * It's used to fill the input (and the list box options if `renderOption` is not provided).
   *
   * @param {T} option
   * @returns {string}
   * @default (option) => option.label ?? option
   */
  getOptionLabel?: (option: T | AutocompleteFreeSoloValueMapping<FreeSolo>) => string

  /**
   * Used to determine if an option is selected, considering the current value.
   * Uses strict equality by default.
   *
   * @param {T} option The option to test.
   * @param {T} value The value to test against.
   * @returns {boolean}
   */
  getOptionSelected?: (option: T, value: T) => boolean
  /**
   * If provided, the options will be grouped under the returned string.
   * The groupBy value is also used as the text for group headings when `renderGroup` is not provided.
   *
   * @param {T} options The options to group.
   * @returns {string}
   */
  groupBy?: (option: T) => string
  /**
   * If `true`, the component handles the "Home" and "End" keys when the popup is open.
   * It should move focus to the first option and last option, respectively.
   * @default !props.freeSolo
   */
  handleHomeEndKeys?: boolean
  /**
   * The input value.
   */
  inputValue?: string
  /**
   * The component used to render the listbox.
   */
  ListboxComponent?: React.ComponentType<React.HTMLAttributes<HTMLElement>>
  /**
   * If `true`, the component is in a loading state.
   * This shows the `loadingText` in place of suggestions (only if there are no suggestions to show, e.g. `options` are empty).
   * @default false
   */
  loading?: boolean
  /**
   * Text or Component to display when there are no options.
   *
   * For localization purposes, you can use the provided [translations](/guides/localization/).
   */
  noOptionsText?: React.ReactNode
  /**
   * Callback fired when the value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {T|T[]} value The new value of the component.
   * @param {string} reason One of "createOption", "selectOption", "removeOption", "blur" or "clear".
   * @param {string} [details]
   */
  onChange?: (
    event: React.ChangeEvent<any>,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => void
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {string} reason Can be: `"toggleInput"`, `"escape"`, `"selectOption"`, `"removeOption"`, `"blur"`.
   */
  onClose?: (event: React.SyntheticEvent, reason: AutocompleteCloseReason) => void
  /**
   * Callback fired when the input value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {string} value The new value of the text input.
   * @param {string} reason Can be: `"input"` (user input), `"reset"` (programmatic change), `"clear"`.
   */
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   */
  onOpen?: (event: React.SyntheticEvent) => void
  /**
   * Callback fired when the highlight option changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {T} option The highlighted option.
   * @param {string} reason Can be: `"keyboard"`, `"auto"`, `"mouse"`.
   */
  onHighlightChange?: (
    event: React.SyntheticEvent,
    option: T | null,
    reason: AutocompleteHighlightChangeReason,
  ) => void
  /**
   * If `true`, the component is shown.
   */
  open?: boolean
  /**
   * If `true`, the popup will open on input focus.
   * @default false
   */
  openOnFocus?: boolean
  /**
   * Array of options.
   * @default []
   */
  options: T[]
  /**
   * Optional placeholder text to show in TextField
   */
  placeholder?: string
  /**
   * Render the group.
   *
   * @param {AutocompleteRenderGroupParams} params The group to render.
   * @returns {ReactNode}
   */
  renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode
  /**
   * Render the option, use `getOptionLabel` by default.
   *
   * @param {object} props The props to apply on the li element.
   * @param {T} option The option to render.
   * @param {object} state The state of the component.
   * @returns {ReactNode}
   */
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T,
    state: AutocompleteRenderOptionState,
  ) => React.ReactNode
  /**
   * Render the selected value.
   *
   * @param {T[]} value The `value` provided to the component.
   * @param {function} getTagProps A tag props getter.
   * @returns {ReactNode}
   */
  renderTags?: (value: T[], getTagProps: AutocompleteGetTagProps) => React.ReactNode
  /**
   * Renders a single selected value
   *
   * @param {T} value The `value` provided to the component
   * @returns {ReactNode}
   */
  renderValue?: (value: T) => React.ReactNode
  /**
   * If `true`, the input's text is selected on focus.
   * It helps the user clear the selected value.
   * @default !props.freeSolo
   */
  selectOnFocus?: boolean
  /**
   * If `true`, `value` must be an array and the menu will support multiple selections.
   * @default false
   */
  multiple?: Multiple
  /**
   * The value of the autocomplete.
   *
   * The value must have reference equality with the option in order to be selected.
   * You can customize the equality behavior with the `isOptionEqualToValue` prop.
   */
  value?: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
  /**
   * If true, will virtualize the listbox component for improved performance. This will
   * override the ListboxComponent property if provided.
   * @default false
   */
  virtualize?: boolean
}
