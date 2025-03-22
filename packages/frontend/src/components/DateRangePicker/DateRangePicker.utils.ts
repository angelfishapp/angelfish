import clsx from 'clsx'
import { isAfter, isBefore, isSameDay, isSameMonth, isWithinInterval } from 'date-fns'

import type { DateRange } from './DateRangePicker.interface'

/**
 * Check if the current day and returns list of class names to apply to the day
 *
 * @param date          The date to check
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @param hoverDate     The date that is currently hovered, null if not hovered
 * @param month         The month to check if the date is in
 * @param minDate       The minimum date that can be selected
 * @param maxDate       The maximum date that can be selected
 * @returns             String list of Classnames to apply to current day
 */
export function getDayClassNames(
  date: Date,
  month: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): string {
  return clsx(
    isDateSelected(date, startDate, endDate) && 'selected',
    isDateWithinRange(date, startDate, endDate, hoverDate)
      ? endDate
        ? 'inRange'
        : 'inHoverRange'
      : undefined,
    isDateRangeStart(date, startDate, endDate, hoverDate) && 'rangeStart',
    isDateRangeEnd(date, startDate, endDate, hoverDate) && 'rangeEnd',
    (minDate && isBefore(date, minDate)) || (maxDate && isAfter(date, maxDate))
      ? 'disabled'
      : undefined,
    !isSameMonth(date, month) && 'outOfMonth',
    isToday(date) && 'today',
  )
}

/**
 * Check if the current date is disabled
 *
 * @param date          The date to check
 * @param month         The month to check if the date is in
 * @param minDate       The minimum date that can be selected
 * @param maxDate       The maximum date that can be selected
 * @returns             True if the date is disabled, false otherwise
 */
export function isDateDisabled(
  date: Date,
  month: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  return (
    (minDate && isBefore(date, minDate)) ||
    (maxDate && isAfter(date, maxDate)) ||
    !isSameMonth(date, month)
  )
}

/**
 * Checks if current date range matches date range to determine if it is selected or not
 *
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @param dateRange     The date range to check
 * @returns             True if the date range is selected, false otherwise
 */
export function isRangeSelected(
  startDate: Date | null,
  endDate: Date | null,
  dateRange: DateRange,
): boolean {
  if (!startDate || !endDate) {
    return false
  }
  if (isSameDay(startDate, dateRange.start) && isSameDay(endDate, dateRange.end)) {
    return true
  }
  return false
}

/**
 * Utility function to compare 2 date ranges and check if they are the same
 *
 * @param range1  The first date range
 * @param range2  The second date range
 * @returns     True if the date ranges are the same, false otherwise
 */
export function isSameRange(range1: DateRange, range2: DateRange): boolean {
  return isSameDay(range1.start, range2.start) && isSameDay(range1.end, range2.end)
}

/**
 * Check if the current day is selected or not
 *
 * @param date          The date to check
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @returns             True if the date is selected, false otherwise
 */
function isDateSelected(date: Date, startDate: Date | null, endDate: Date | null): boolean {
  return (
    (startDate !== null && isSameDay(date, startDate)) ||
    (endDate !== null && isSameDay(date, endDate))
  )
}

/**
 * Check if the current day is in the range
 *
 * @param date          The date to check
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @param hoverDate     The date that is currently hovered, null if not hovered
 * @returns             True if the date is in the range, false otherwise
 */
function isDateWithinRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null,
): boolean {
  // If both start and end date are selected, check if the date is within the range
  if (startDate && endDate) {
    return isWithinInterval(date, { start: startDate, end: endDate })
  }

  // If only the start date is selected, check if the date is between start date and hover date
  if (startDate && hoverDate) {
    if (startDate.getTime() < hoverDate.getTime()) {
      return isWithinInterval(date, { start: startDate, end: hoverDate })
    } else if (startDate.getTime() > hoverDate.getTime()) {
      return isWithinInterval(date, { start: hoverDate, end: startDate })
    }
  }

  // Return false by default
  return false
}

/**
 * Check if current day is the start of the range
 *
 * @param date          The date to check
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @param hoverDate     The date that is currently hovered, null if not hovered
 * @returns             True if the date is in the start of the range, false otherwise
 */
function isDateRangeStart(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null,
): boolean {
  // If range set, check if date is the start of the range
  if (startDate && endDate) {
    return isSameDay(date, startDate)
  }

  // If only start date set, check if date is hoverDate and the start of the range
  if (startDate && hoverDate) {
    if (startDate.getTime() < hoverDate.getTime()) {
      return isSameDay(date, startDate)
    }

    if (startDate.getTime() > hoverDate.getTime()) {
      return isSameDay(date, hoverDate)
    }
  }

  // Return false by default
  return false
}

/**
 * Check if current day is the end of the range
 *
 * @param date          The date to check
 * @param startDate     The start date of the range, null if not selected
 * @param endDate       The end date of the range, null if not selected
 * @param hoverDate     The date that is currently hovered, null if not hovered
 * @returns             True if the date is in the start of the range, false otherwise
 */
function isDateRangeEnd(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null,
): boolean {
  // If range set, check if date is the end of the range
  if (startDate && endDate) {
    return isSameDay(date, endDate)
  }

  // If only start date set, check if date is hoverDate and the start of the range
  if (startDate && hoverDate) {
    if (startDate.getTime() < hoverDate.getTime()) {
      return isSameDay(date, hoverDate)
    }

    if (startDate.getTime() > hoverDate.getTime()) {
      return isSameDay(date, startDate)
    }
  }

  // Return false by default
  return false
}

/**
 * Determine if the date is today
 *
 * @param date  The date to check
 * @returns     True if the date is today, false otherwise
 */
function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}
