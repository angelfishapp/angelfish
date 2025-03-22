import type { DateRange } from '@/components/DateRangePicker'
import type { FormFieldProps } from '../FormField'

/**
 * DateRangeField Component Properties
 */

export interface DateRangeFieldProps extends FormFieldProps {
  /**
   * Display input field border. If false will show borderless input field.
   * @default true
   */
  border?: boolean
  /**
   * A list of date ranges to display on right for quick range selection
   * IMPORTANT: Ensure DateRange times (hours, minutes, seconds, milliseconds)
   * are zeroed out to ensure data range matching works correctly
   */
  dateRanges?: { [key: string]: DateRange }
  /**
   * If true, the input field will display the date range label if a quick range
   * selection is selected. Will show the date range if no quick range is selected.
   * @default false
   */
  displayRangeLabel?: boolean
  /**
   * Optionally set a new icon at end of input field instead of default calendar icon
   * @default DateRangeIcon
   */
  endAdornment?: React.ReactNode
  /**
   * Set a minimum selectable date, all date before this date will be disabled
   */
  minDate?: Date
  /**
   * Set a maxium selectable date, all date after this date will be disabled
   */
  maxDate?: Date
  /**
   * onChange Callback when field value is updated
   */
  onChange?: (range: DateRange) => void
  /**
   * Set value for controlled field
   */
  value?: DateRange
}
