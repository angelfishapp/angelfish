/**
 * Gets the current phase of the day looking at the
 * current hour on the user's system
 */
export function getCurrentPhase() {
  const hour = new Date().getHours()
  switch (true) {
    case hour < 6:
      return 'night'
    case hour < 8:
      return 'morning'
    case hour < 18:
      return 'day'
    case hour < 20:
      return 'evening'
    default:
      return 'night'
  }
}
