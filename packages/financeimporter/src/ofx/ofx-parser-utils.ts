/**
 * Parses an OFX date string into a UTC Date object.OFX dates are typically in the format
 * YYYYMMDDHHMMSS.XXX[gmt offset:HHMM], where:
 *
 * YYYY is the four-digit year.
 * MM is the two-digit month.
 * DD is the two-digit day.
 * HH is the two-digit hour.
 * MM is the two-digit minute.
 * SS is the two-digit second.
 * XXX is optional milliseconds.
 * [gmt offset] is optional and specifies the offset from GMT, such as +HHMM or -HHMM.
 *
 * @param ofxDate   OFX Date string to parse
 * @returns         UTC Date if valid string, or null if empty
 * @throws          Error if invalid date string
 */
export function parseOFXDate(ofxDate: string): Date {
  if (!ofxDate) {
    return null
  }

  const year = parseInt(ofxDate.substring(0, 4), 10)
  const month = parseInt(ofxDate.substring(4, 6), 10)
  const day = parseInt(ofxDate.substring(6, 8), 10)

  if (ofxDate.length === 8) {
    // Date uses 0 based months, so we need to subtract 1
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
  }

  const hour = parseInt(ofxDate.substring(8, 10), 10)
  const minute = parseInt(ofxDate.substring(10, 12), 10)
  const second = parseInt(ofxDate.substring(12, 14), 10)

  if (ofxDate.length === 14) {
    // Date uses 0 based months, so we need to subtract 1
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  }

  let millisecond: number
  const indexOfDot = ofxDate.indexOf('.')
  if (indexOfDot > -1) {
    millisecond = parseInt(ofxDate.substring(indexOfDot + 1, indexOfDot + 4), 10)
  }

  let timezone: string
  const indexOfStartBracket = ofxDate.indexOf('[')
  const indexOfLastBracket = ofxDate.indexOf(']')
  if (indexOfStartBracket > -1 && indexOfLastBracket > -1) {
    const ofxOffset = ofxDate.substring(indexOfStartBracket + 1, indexOfLastBracket)

    // Handle 0 offset
    if (ofxOffset === '0:GMT' || ofxOffset === '0:UTC' || ofxOffset === '0') {
      // Date uses 0 based months, so we need to subtract 1
      return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
    }

    // Regex to match the OFX timezone format
    const ofxRegex = /^([-+])(\d{1,2})(?:\.(\d+))?(?::(\w+))?$/
    const match = ofxRegex.exec(ofxOffset)

    if (!match) {
      throw new Error(`Invalid OFX timezone format [${ofxOffset}]`)
    }

    const [, sign, offsetHr, fractionalPart, _tzName] = match

    // Calculate the hour and minute offsets
    const hourOffset = parseInt(offsetHr, 10)
    const minuteOffset = fractionalPart ? Math.round(parseFloat(`0.${fractionalPart}`) * 60) : 0

    // Format to ISO 8601
    timezone = `${sign}${hourOffset.toString().padStart(2, '0')}:${minuteOffset
      .toString()
      .padStart(2, '0')}`
  }

  if (millisecond !== undefined && !timezone) {
    // Date uses 0 based months, so we need to subtract 1
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond))
  }

  if (millisecond === undefined && timezone) {
    millisecond = 0
  }

  if (millisecond !== undefined && timezone) {
    // Construct ISO 8601 date string
    const dateString =
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` +
      `T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:` +
      `${second.toString().padStart(2, '0')}.${millisecond.toString().padStart(3, '0')}${timezone}`

    const date = new Date(dateString)
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds(),
      ),
    )
  }
  throw new Error(`Bad date format [${ofxDate}]`)
}
