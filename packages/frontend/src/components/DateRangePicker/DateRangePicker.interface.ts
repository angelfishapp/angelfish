/**
 * Interface for a DateRange
 */
export interface DateRange {
  /**
   * Start Date of the Range
   */
  start: Date
  /**
   * End Date of the Range
   */
  end: Date
}

/**
 * DateRangePicker Component Properties
 */
export interface DateRangePickerProps {
  /**
   * A list of date ranges to display on right for quick range selection
   * IMPORTANT: Ensure DateRange times (hours, minutes, seconds, milliseconds)
   * are zeroed out to ensure data range matching works correctly
   */
  dateRanges?: { [key: string]: DateRange }
  /**
   * Set a minimum selectable date, all date before this date will be disabled
   */
  minDate?: Date
  /**
   * Set a maxium selectable date, all date after this date will be disabled
   */
  maxDate?: Date
  /**
   * Set value for controlled field
   */
  value?: DateRange | null
  /**
   * onSelect Callback when field value is updated
   */
  onSelect?: (range: DateRange) => void
}
