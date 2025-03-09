import { promises as dns } from 'dns'

/**
 * Helper function to check if user is online or not
 *
 * @returns   True if online, False if Offline
 */
export async function checkOnlineStatus(): Promise<boolean> {
  try {
    // Attempt to resolve a common domain (e.g., Google)
    await dns.resolve('www.google.com')
    return true // Online if resolution succeeds
  } catch (_err) {
    return false // Offline if an error occurs
  }
}
